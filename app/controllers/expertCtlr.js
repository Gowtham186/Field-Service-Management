import Category from "../models/category-model.js";
import Expert from "../models/expert-model.js"
import ServiceRequest from "../models/serviceRequest-model.js";
import Skill from "../models/skill-model.js";
import mongoose from "mongoose";
import axios from "axios";
const expertCtlr = {}

expertCtlr.create = async (req, res) => {
    try {
        const body = req.body;

        if (typeof body.skills === 'string') {
            body.skills = JSON.parse(body.skills);
        }
        if (typeof body.location === 'string') {
            body.location = JSON.parse(body.location);
        }

        console.log('Request Body:', JSON.stringify(req.body, null, 2));  
        console.log('Request Files:', JSON.stringify(req.files, null, 2));


        let profilePicUrl = null

        if(req.files && req.files['profilePic'] && req.files['profilePic'][0]){
            profilePicUrl = req.files['profilePic'][0].path
        }

        if (req.files && req.files['documents']) {
            const uploadDocuments = req.files['documents'].map((file) => ({
                pathName: file.path,
                type: file.mimetype,
                isVerified: "pending",
            }));
            body.documents = uploadDocuments;
        }

        // Process skills to either find existing ones or create new ones
        const createSkills = await Promise.all(
            body.skills.map(async (ele) => {
                let skill;
                if (mongoose.Types.ObjectId.isValid(ele)) {
                    skill = await Skill.findOne({ _id: ele });
                } else {
                    skill = await Skill.findOne({ name: ele });
                    if (!skill) {
                        skill = await Skill.create({ name: ele });
                    }
                }
                return skill._id;
            })
        );
        body.skills = createSkills; 

        const expert = new Expert(body);

        const existAddress = await Expert.findOne({ 'location.address': body.location.address });
        
        if (!existAddress) {
            const resource = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: { q: body.location.address, key: process.env.OPENCAGE_API_KEY }
            });

            if (resource.data.results.length > 0) {
                expert.location.coords = resource.data.results[0].geometry;
            } else {
                return res.status(400).json({ errors: 'Invalid address, please try another.' });
            }
        } else {
            expert.location.coords = existAddress.location.coords;
        }

        if(profilePicUrl){
            expert.profilePic = profilePicUrl
        }
        
        expert.userId = req.currentUser.userId;
        console.log(expert)
        await expert.save();

        res.json(expert);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong, please try again later.' });
    }
};

expertCtlr.getAllExperts = async (req,res) => {
    try{
        const allExperts = await Expert.find()
            .populate('userId')
            .populate('skills')
        res.json(allExperts)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.unVerifiedExperts = async (req,res) => {
    try{
        const allExperts = await Expert.find({isVerified: false})
            .populate('userId')
            .populate('categories')
        res.json(allExperts)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.getProfile = async(req,res)=>{
    const id = req.params.id
    try{
        const expert = await Expert.findOne({userId : id})
            .populate('skills')
            .populate('userId')
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
    const id = req.currentUser.userId
    const body  = req.body
    try{
        const expert = await Expert.findOne({userId : id})
            .populate('categories', 'name')

        if(!expert){
            return res.status(404).json({errors : 'record not found'})
        }
        console.log(body.location.address)
        if(body.location.address){
            const existAddress = await Expert.findOne({'location.address' : body.location.address})
            console.log(existAddress)
            if(!existAddress){
                const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                    params :{ q : body.location.address,  key : process.env.OPENCAGE_API_KEY }
                })
                console.log(resource.data)
                if(resource.data.results.length > 0){
                    expert.location.coords = resource.data.results[0].geometry
                    expert.location.address = body.location.address
                }else{
                    return res.status(400).json({errors : 'try other address'})
                }
            }else{
                expert.location.coords = existAddress.location.coords
                expert.location.address = body.location.address
            }
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
        await expert.save()
        console.log(expert)
        return res.json(expert)

    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.verify = async(req,res)=>{
    const id = req.params.id
    const { isVerified } = req.body
    try{

        const verifyExpert = await Expert.findOneAndUpdate(
            { userId : id }, 
            { $set : { isVerified }},
            { new: true }
        );
        if(!verifyExpert){
            return res.status(404).json({errors : 'expert record not found'})
        }
        res.json(verifyExpert)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.availability = async (req,res)=>{
    try{
        const expert = await Expert.findOne({userId : req.currentUser.userId})
            .populate('availability.serviceId')

        res.json(expert.availability)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

export default expertCtlr