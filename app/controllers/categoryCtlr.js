import { validationResult } from "express-validator";
import Category from "../models/category-model.js";
import Service from "../models/service-model.js";
import categoryValidation from "../validators/category-validation.js";

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
       return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.getAllCategory = async(req,res)=>{
    try{
        const allcategory = await Category.find()
        res.json(allcategory)
    }catch(err){
       return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.getCategory = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const id = req.params.id
    try{
        const category = await Category.findById(id)
        if(!category){
            return res.status(404).json({errors : 'category not found'})
        }
        res.json(category)
    }catch(err){
        return res.status(500).json({errors : 'something went wrong'})
    }
}


categoryCtlr.getServicesByCategory = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const id = req.params.id
    try{
        const category = await Service.find({category : id})
        if(!category){
            return res.status(404).json({errors : 'no services found'})
        }
        res.json(category)
        
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.addService = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const { categoryId } = req.params
    const body = req.body 
    try{
        const newService = new Service(body)
        newService.category = categoryId

        await newService.save()
        res.json(newService)
        
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.removeService = async(req,res)=>{
    const { categoryId, serviceId } = req.params
    try{
        const deleteService = await Service.findOneAndDelete({category : categoryId, _id : serviceId})

        if(!deleteService){
            return res.status(404).json({errors : 'category or service not found'})
        }

        res.json(deleteService)

    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.getSingleService = async(req,res)=>{
    const { categoryId, serviceId} = req.params
    try{
        const service = await Service.findOne({category : categoryId, _id: serviceId}) 
        if(!service){
            return res.status(404).json({errors : 'service not found'})
        }
        res.json(service)        
    }catch(err){
        return res.status(500).json({errors : 'something went wrong'})
    }
}

export default categoryCtlr

