import { validationResult } from "express-validator";
import Category from "../models/category-model.js";
import Service from "../models/service-model.js";
import categoryValidation from "../validators/category-validation.js";
import Skill from "../models/skill-model.js";
import mongoose from "mongoose";

const categoryCtlr = {}

categoryCtlr.create = async (req, res) => {

    const body = req.body;
    try {
        
        
        let skillId = null;

        if(body.skill){
            let existingSkill = await Skill.findOne({name : body.skill})

            if(!existingSkill){
                const newSkill = new Skill({ name : body.skill })
                existingSkill = await newSkill.save()
            }

            skillId = existingSkill._id
        }
        
        const newCategory = await Category.create({ ...body, skill : skillId});

        let newServices = []
        if(body.services){
            newServices = await Promise.all(
                body.services.map(async (service) => {
                    const newService = new Service({
                        serviceName: service.serviceName,
                        price: service.price,
                        category: newCategory._id
                    });
                    return newService.save();
                })
            );
        }

        const findSkill = await Skill.findById(skillId)
        
        console.log({ ...newCategory.toObject(), skill : skillId, services: newServices });
        return res.status(201).json({ ...newCategory.toObject(), skill : findSkill, services: newServices });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ errors: 'Something went wrong' });
    }
};


// categoryCtlr.getAllCategory = async(req,res)=>{
//     try{
//         const allcategory = await Category.find()
//         res.json(allcategory)
//     }catch(err){
//        return res.status(500).json({errors : 'something went wrong'})
//     }
// }

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
    const { serviceId } = req.params
    console.log('categoryCltr')
    try{
        const deleteService = await Service.findByIdAndDelete(serviceId)

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

//
categoryCtlr.categoriesWithServices = async (req,res)=>{
    const category = req.query.category || ""
    console.log("category", category)
    try{
        const pipeline = []

        if(category){
            pipeline.push({
                $match : { _id : new mongoose.Types.ObjectId(category)}
            })
        }

        pipeline.push(
            {
                $lookup : {
                    from : "services",
                    localField : "_id",
                    foreignField : "category",
                    as : "services"
                }
            },
            {
                $lookup: {
                    from: "skills", 
                    localField: "skill",
                    foreignField: "_id",
                    as: "skill"
                }
            },
            {
                $set: {
                    skill: { $arrayElemAt: ["$skill", 0] } // Extract the first (and only) element from the skill array
                }
            }
        )
        const categories = await Category.aggregate(pipeline)
        console.log(categories)
        res.json(categories)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.updateCategoryWithServices = async(req,res)=>{
    const id = req.params.id
    console.log('id', id)
    const { name, skill, services } = req.body
    try{
        const updatedCategory = await Category.findByIdAndUpdate(id, 
            { name : name, skill : skill.value}, 
            { new : true}
        ).populate('skill')

        if(!updatedCategory){
            return res.status(404).json({errors : 'category not found'})
        }

        const updatedServices = await Promise.all(services.map(async(service) => {
            if(service._id){
                return Service.findByIdAndUpdate(
                    service._id, 
                    { serviceName : service.serviceName, price : service.price}, 
                    { new : true})
            }else{
                const newService = new Service({
                    serviceName : service.serviceName,
                    price : service.price,
                    category : updatedCategory._id
                })
                return newService.save()
            }
        }
        ))
        console.log(updatedCategory)

        return res.json({...updatedCategory.toObject(), services : updatedServices})

    }catch(err){
        console.log(err)
        return res.status(500).json({errors :'something went wrong'})
    }
}

categoryCtlr.deleteCategoryAndServices = async (req,res)=>{
    const { id } = req.params
    console.log(id)
    try{
        const category =  await Category.findById(id)

        if(!category){
            return res.status(404).json({errors : 'category not found'})
        }

        await Service.deleteMany({category})

        await Category.findByIdAndDelete(id)

        res.json(category) //only returnig category not with services
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

categoryCtlr.getCategoryAndServicesBySkill = async(req,res)=>{
    const { skill } = req.params
    console.log(skill)
    try{
        const category = await Category.findOne({skill : skill})
        console.log(category)

        if(!category){
            return res.status(404).json({errors : 'no categry found on this skill'})
        }
        
        const services = await Service.find({category : category._id})
        
        res.json({...category.toObject(), services : services})
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
        
    }
}

export default categoryCtlr