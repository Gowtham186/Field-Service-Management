import { validationResult } from "express-validator";
import Skill from "../models/skill-model.js";

const skillCtlr = {}

skillCtlr.create = async(req, res)=>{
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const body = req.body
    try{
        const skill = await Skill.create(body)
        res.json(skill)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

skillCtlr.getAllSkills = async(req,res)=>{
    try{
        const allSkills = await Skill.find()
        res.json(allSkills)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

export default skillCtlr

