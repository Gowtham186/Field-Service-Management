import Category from "../models/category-model.js";
import Expert from "../models/expert-model.js"
import ServiceRequest from "../models/serviceRequest-model.js";
import Skill from "../models/skill-model.js";
import mongoose from "mongoose";
import axios from "axios";
import Service from "../models/service-model.js";
import User from "../models/user-model.js";
import nodemailer from 'nodemailer'

import Stripe from "stripe"
import Payment from "../models/payment-model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const transporter = nodemailer.createTransport({
    service :"Gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})

const expertCtlr = {}

expertCtlr.create = async (req, res) => {
    try {
        const body = req.body;
        console.log(body)

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

        const user = await User.findById(req.currentUser.userId)
        console.log(user)

        const mailOptions = {
            from : process.env.EMAIL_USER,
            to : user.email,
            subject: "Expert Registration Successful",
            html: `
                <h3>Welcome to Our Platform, ${user.name}!</h3>
                <p>Your registration as an expert is successful. Our team will review your profile, and you will be notified once your account is verified.</p>
                <p>Best Regards,</p>
                <p>Your Company Team</p>
            `, 
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log("Error sending email :", error)
            }else{
                console.log("Email sent :", info.response)
            }

        })

        //mailToAdmin
         const skillNames = await Skill.find({ _id: { $in: body.skills } }).select("name");
        console.log(skillNames)
        const mailToAdmin = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            subject: "New Expert Registered",
            html: `
                <h3>New Expert Registration</h3>
                <p>A new expert has registered on the platform.</p>
                <ul>
                    <li><strong>Name:</strong> ${user.name}</li>
                    <li><strong>Email:</strong> ${user.email}</li>
                    <li><strong>Phone:</strong> ${user.phone_number}</li>
                    <li><strong>Skills:</strong> ${skillNames.map(ele => ele.name).join(", ")}</li>
                    <li><strong>Location:</strong> ${body.location.address}</li>
                </ul>
                <p>Please review the expert's profile for approval.</p>
            `,
        };

        transporter.sendMail(mailToAdmin, (error, info) => {
            if (error) {
                console.error("Error sending email to admin:", error);
            } else {
                console.log("Admin notification email sent:", info.response);
            }
        });
        
        res.json(expert);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong, please try again later.' });
    }
};

expertCtlr.getAllExperts = async (req, res) => {
    try {
        const search = req.query.search || '';
        const skill = req.query.skill || ''  
        const verified = req.query.verified || ''
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit 

        const pipeline = [
            { $lookup : { from : 'users', localField : 'userId', foreignField : '_id', as : "expert"}},
            { $unwind : { path : '$expert', preserveNullAndEmptyArrays : true}},

            { $lookup: { from: "skills", localField: "skills", foreignField: "_id", as: "skills"}}

        ]

        const matchStage = {}
        if(search){
            matchStage.$or = [
                {"expert.name" : { $regex : search, $options : "i"}}
            ]
        }

        if(skill){
            matchStage["skills.name"] = { $regex : skill, $options : "i"}
        }
        if(verified) matchStage.isVerified = verified === 'true'

        if(Object.keys(matchStage).length > 0 ){
            pipeline.push({ $match : matchStage})
        }

        const totalExperts = await Expert.countDocuments(matchStage)
        pipeline.push({ $skip : skip}, { $limit : limit})

        const experts = await Expert.aggregate(pipeline)

        // console.log(experts)

        res.json({
            data : experts,
            totalPages : Math.ceil(totalExperts / limit),
            currentPage : page,
            totalExperts
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};

expertCtlr.unVerifiedExperts = async (req,res) => {
    try{
        const experts = await Expert.find({isVerified: false})
            .populate('userId')
            .populate('skills')
        console.log(experts)
        res.json(experts)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

expertCtlr.getProfile = async(req,res)=>{
    const id = req.params.id
    console.log(id)
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

expertCtlr.verify = async (req, res) => {
    const id = req.params.id;
    const { isVerified } = req.body;

    try {
        // 1️⃣ Update verification status
        const verifyExpert = await Expert.findOneAndUpdate(
            { userId: id },
            { $set: { isVerified } },
            { new: true }
        );

        if (!verifyExpert) {
            return res.status(404).json({ error: "Expert record not found" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2️⃣ Check if expert already has a Stripe account
        if (verifyExpert.stripeAccountId) {
            return res.status(400).json({ error: "Expert already has a Stripe account" });
        }

        // 3️⃣ Create a Stripe Express account for the expert
        const stripeAccount = await stripe.accounts.create({
            type: "express",
            country: "US", // Change based on the expert's country
            email: user.email, 
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        // 4️⃣ Save the Stripe account ID in the database
        verifyExpert.stripeAccountId = stripeAccount.id;
        await verifyExpert.save();

        // 5️⃣ Generate an onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.id,
            refresh_url: "http://localhost:3000/stripe-onboarding",
            return_url: "http://localhost:3000/",
            type: "account_onboarding",
        });

        // 6️⃣ Send an email with the onboarding link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "You're Verified! Complete Your Stripe Account Setup",
            html: `
                <h3>Congratulations, ${user.name}!</h3>
                <p>Your expert account has been verified.</p>
                <p>Please complete your Stripe verification by clicking the link below:</p>
                <a href="${accountLink.url}" target="_blank">Complete Stripe Setup</a>
                <p>Once completed, you'll be ready to receive payments.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        // res.status(200).json({
        //     message: "Expert verified, Stripe account created, and onboarding email sent!",
        //     stripeAccountId: stripeAccount.id,
        //     onboardingLink: accountLink.url,
        // });
        console.log("Expert verified, Stripe account created, and onboarding email sent!")
        res.json(verifyExpert)

    } catch (err) {
        console.error("Stripe onboarding error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};




expertCtlr.updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        console.log(availability)
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
        console.log('wes',updatedAvailability.availability)
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
        // console.log(expertCategories)   
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

expertCtlr.changeProfilePic = async (req,res)=>{
    const { id } = req.params
    try{
        let profilePicUrl = null

        if(req.files && req.files['profilePic'] && req.files['profilePic'][0]){
            profilePicUrl = req.files['profilePic'][0].path
        }
        
        if(profilePicUrl){
            const expert = await Expert.findOneAndUpdate(
                { userId : id},
                { profilePic : profilePicUrl}
            )
            console.log(expert.profilePic)
            res.json(expert.profilePic)
        }
        if(!profilePicUrl){
            return res.status(400).json({errors:'something went wrong'})
        }
    }catch(err){
        console.log(err)
    }
}
    
export default expertCtlr