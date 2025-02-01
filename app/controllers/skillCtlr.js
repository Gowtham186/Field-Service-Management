import Skill from "../models/skill-model.js"

const skillCtlr = {}

skillCtlr.create = async(req, res)=>{
    const body = req.body
    try{
        const skill = await Skill.create(body)
        res.status(201).json(skill)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

skillCtlr.getAllSkills = async(req,res)=>{
    try{
        const skills = await Skill.find()
        res.json(skills)
    }catch(err){
        return res.status(500).json({errors : 'something went wrong'})
    }
}

export default skillCtlr