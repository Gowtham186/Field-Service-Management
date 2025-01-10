import Category from "../models/category-model.js";
import Expert from "../models/expert-model.js"

const expertCtlr = {}

expertCtlr.create = async (req, res) => {   
    try {
        const body = req.body;

        if(body.categories && typeof body.categories == 'string'){
            body.categories = JSON.parse(body.categories)
        }
        if(body.location && typeof body.location == 'string'){
            body.location = JSON.parse(body.location)
        }
        
        if (req.files && req.files.length > 0) {
            const uploadDocuments = req.files.map((file) => ({
                pathName: file.path,
                type: file.mimetype,
                isVerified: "pending", 
            }));
            body.documents = uploadDocuments;
        }

        //console.log("Documents:", body.documents); 
        //console.log("Body:", body); 

        const expert = new Expert(body);
        expert.userId = req.currentUser.userId; 
        await expert.save(); 

        res.json(expert);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ errors: "Something went wrong" }); 
    }
};

expertCtlr.getProfile = async(req,res)=>{
    const id = req.params.id
    try{
        const expert = await Expert.findOne({userId : id})
            .populate('categories', 'name')
            .populate('userId', 'phone_number')
        if(!expert){
            return res.status(404).json({errors : 'expert not found'})
        }
        return res.json(expert)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.profileUpdate = async(req,res)=>{
    const id = req.params.id
    const body  = req.body
    try{
        const expert = await Expert.findOne({userId : id})
            .populate('categories', 'name')
        if(!expert){
            return res.status(404).json({errors : 'record not found'})
        }

        if(body.categories){
            const newCategories = body.categories.map(category => category._id || category)
            
            await Expert.findOneAndUpdate(
                {userId : id},
                { 
                    $addToSet : { categories : { $each : newCategories } },  //it adds unique/new category
                    $set : { location : body.location, experience : body.experience} //updating
                },
                { new : true}
            )
        }else{
            await Expert.findOneAndUpdate(
                {userId : id},
                { $set : { location : body.location, experience : body.experience}}, 
                {new : true}
            )
        }

        /* if(body.categories){
           const newCategories = body.categories.filter(newCat => !expert.categories.some(existCat => existCat._id.equals(newCat._id)))
           console.log(newCategories)
           expert.categories = [...expert.categories, ...newCategories]
        } */
        return res.json(expert)

    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.verify = async(req,res)=>{
    const id = req.params.id
    const body = req.body
    try{
        if(body.isVerified === true){
            body["documents.$[].isVerified"] = "verified"
        }else{
            body["documents.$[].isVerified"] = "pending"
        }
        const verifyExpert = await Expert.findByIdAndUpdate(id, body, { new : true, runValidators: true})
        if(!verifyExpert){
            return res.status(404).json({errors : 'record not found'})
        }
        res.json(verifyExpert)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}


export default expertCtlr