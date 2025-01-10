import { validationResult } from "express-validator";
import Category from "../models/category-model.js";

const categoryCtlr = {}

categoryCtlr.create = async(req, res)=>{
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const body = req.body
    try{
        const category = await Category.create(body)
        res.json(category)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.getAllCategory = async(req,res)=>{
    try{
        const allcategory = await Category.find()
        res.json(allcategory)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

export default categoryCtlr

