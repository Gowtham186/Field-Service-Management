import Expert from "../models/expert-model.js"

const expertCtlr = {}

expertCtlr.create = async (req, res) => {   
    try {
        const body = req.body;

        if(body.skills && typeof body.skills == 'string'){
            body.skills = JSON.parse(body.skills)
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

expertCtlr.profileUpdate = async(req,res)=>{
    const id = req.params.id
    const body  = req.body
    try{
        const updateExpert = await Expert.findByIdAndUpdate({_id : id}, body, { new : true, runValidators : true}).populate('userId')
        if(!updateExpert){
            return res.status(404).json({errors : 'record not found'})
        }
        res.json(updateExpert)

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