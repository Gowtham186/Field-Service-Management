import Skill from "../models/skill-model.js"

const skillCtlr = {}

skillCtlr.create = async(req, res)=>{
    const { skill } = req.body
    try{
        const newSkill = await Skill.create({name : skill})
        res.status(201).json(newSkill)
        console.log(newSkill)
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