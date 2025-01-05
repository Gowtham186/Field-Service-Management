import Expert from "../models/expert-model.js"

const expertCtlr = {}

expertCtlr.create = async(req,res)=>{
    try{
       const body = req.body

       if(req.files && req.files.length > 0){
            const updloadDocuments = req.files.map(file=>({
                pathName : file.path,
                type : file.mimetype,
                isVerified : "pending"
            }))
            body.documents = updloadDocuments
       }

        const expert = new Expert(body)
        expert.userId = req.currentUser.userId    
        await expert.save()
        res.json(expert)  
    }catch(err){
        res.status(500).json({errors: 'something went wrong'})
    }
}

export default expertCtlr