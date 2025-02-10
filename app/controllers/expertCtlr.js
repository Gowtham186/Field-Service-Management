import Category from "../models/category-model.js";
import Expert from "../models/expert-model.js"
import ServiceRequest from "../models/serviceRequest-model.js";
import Skill from "../models/skill-model.js";
import mongoose from "mongoose";
import axios from "axios";
import Service from "../models/service-model.js";
import User from "../models/user-model.js";
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

expertCtlr.getAllExperts = async (req, res) => {
    try {
        const search = req.query.search || '';  
        
        const experts = await Expert.find()
            .populate('userId', 'name') 
            .populate('skills', 'name') 
            .exec();

            console.log(experts)

          res.json(experts)
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};

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

expertCtlr.updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        
        // Ensure availability is an array
        if (!Array.isArray(availability)) {
            return res.status(400).json({ error: "Availability must be an array of dates." });
        }

        // Convert valid date strings to Date objects
        const validDates = availability
            .map(date => new Date(date))
            .filter(date => !isNaN(date)); // Remove invalid dates

        if (validDates.length === 0) {
            return res.status(400).json({ error: "No valid dates provided." });
        }

        // Find expert by userId
        const expert = await Expert.findOne({ userId: req.currentUser.userId });
        if (!expert) {
            return res.status(404).json({ error: "Expert not found" });
        }

        // Extract existing dates
        const existingDates = expert.availability || [];

        // Convert dates to ISO format for comparison
        const formattedAvailability = validDates.map(date => date.toISOString().split("T")[0]);
        const formattedExistingDates = existingDates.map(date => new Date(date).toISOString().split("T")[0]);

        // Get dates to add
        const datesToAdd = formattedAvailability.filter(date => !formattedExistingDates.includes(date));

        // Get dates to remove
        const datesToRemove = formattedExistingDates.filter(date => !formattedAvailability.includes(date));

        let updatedAvailability = expert.availability;

        // Add new dates
        if (datesToAdd.length > 0) {
            updatedAvailability = await Expert.findOneAndUpdate(
                { userId: req.currentUser.userId },
                { $addToSet: { availability: { $each: datesToAdd } } },
                { new: true, projection: { availability: 1 } }
            );
        }

        // Remove dates
        if (datesToRemove.length > 0) {
            updatedAvailability = await Expert.findOneAndUpdate(
                { userId: req.currentUser.userId },
                { $pull: { availability: { $in: datesToRemove } } },
                { new: true, projection: { availability: 1 } }
            );
        }
        console.log(updatedAvailability.availability)
        return res.json(updatedAvailability ? updatedAvailability.availability : expert.availability);
    } catch (err) {
        console.log("Update Availability Error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

expertCtlr.expertCategoriesBySkills = async (req,res)=>{
    try{
        const id = req.params.id
        const expert = await Expert.findOne({userId : id}).populate('skills')

        if (!expert) {
            return res.status(404).json({ message: "Expert not found" });
        }

        if (!expert.skills || expert.skills.length === 0) {
            return res.status(400).json({ message: "Expert has no skills assigned" });
        }

        const expertCategories = await Promise.all(
            expert.skills.map(async (ele) => {
                const category =  await Category.findOne({ skill: ele._id })
                if(!category) return null
            
                const services = await Service.find({category : category._id})
                return { ...category.toObject(), services}
            })       
        );
        console.log(expertCategories)   
        res.json(expertCategories)         
    }catch(err){
        console.log(err)
    }
}

expertCtlr.getMyServices = async (req, res) => {
    try {
        const expert = await ServiceRequest.find({expertId : req.currentUser.userId})
            .populate('customerId')
            .populate({
                path: "serviceType.category",
                model: "Category", 
                select: "name",
            })
            .populate({
                path: "serviceType.servicesChoosen",
                model: "Service", 
                select: "serviceName price", 
            });
        res.json(expert)
    } catch (err) {
        console.log("Error fetching services:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};   

expertCtlr.updateProfile = async(req,res)=>{
    const { id } = req.params
    console.log(req.body)
    const { userId, skills, experience, location } = req.body
    try{
        const { name, email, phone_number } = userId
        const user = await User.findByIdAndUpdate(id, 
            { name, email, phone_number},
            {new : true})
        console.log(user)

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let expert = await Expert.findOne({userId : id}).populate('skills')
            .populate('userId')
        if (!expert) {
            return res.status(404).json({ error: "Expert profile not found" });
        }

        expert.experience = experience
        if (skills && skills.length > 0) {
            expert.skills = skills.map(skill => skill);
        }

        if (location?.address) {
            try {
                const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                    params: { q: location.address, key: process.env.OPENCAGE_API_KEY },
                });

                if (resource.data.results.length > 0) {
                    expert.location.coords = resource.data.results[0].geometry;
                    expert.location.address = location.address;
                } else {
                    return res.status(400).json({ error: "Invalid address. Try another one." });
                }
            } catch (error) {
                console.error("Error fetching address coordinates:", error);
                return res.status(500).json({ error: "Failed to fetch location data." });
            }
        }
        await expert.save()
        console.log(expert)
        return res.json(expert)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }

}
    
export default expertCtlr