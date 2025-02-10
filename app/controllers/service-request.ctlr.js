import Customer from "../models/customer-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"
import Service from "../models/service-model.js"
import Expert from "../models/expert-model.js"
import User from '../models/user-model.js'
import axios from "axios"
import mongoose from "mongoose"
//import { io } from "../../index.js"

const serviceRequestCtlr = {}

serviceRequestCtlr.create = async (req, res) => {
    const body = req.body;

    try {

        if (body.serviceType && typeof body.serviceType === 'string') {
            body.serviceType = JSON.parse(body.serviceType);
        }
        if (body.location && typeof body.location === 'string') {
            body.location = JSON.parse(body.location);
        }

        console.log(req.files);
        console.log(body);
        
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(file => ({
                pathName: file.path,
                originalName: file.originalname, 
            }));
            body.serviceImages = uploadImages;
        }

        let lat, lng;

        const customerLocation = await Customer.findOne({ 'location.address': body.location.address });
        if (!customerLocation) {
            const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: { q: body.location.address, key: process.env.OPENCAGE_API_KEY },
            });
            const geometry = resource.data.results[0].geometry;
            lat = geometry.lat;
            lng = geometry.lng;
            console.log({ lat, lng });
        } else {
            const geometry = customerLocation.location.coords;
            lat = geometry.lat;
            lng = geometry.lng;
        }

        const updateLocation = { address: body.location.address, coords: { lat, lng } };

        const serviceRequest = new ServiceRequest({
            ...body,
            customerId: req.currentUser.userId,
            location: updateLocation,
            budget: { bookingFee: 50 },
        });

        const selectedServices = body.serviceType.flatMap(({ servicesChoosen }) => servicesChoosen);
        const servicePrices = await Promise.all(selectedServices.map(id => Service.findById(id)));
        serviceRequest.budget.servicesPrice = servicePrices.reduce((sum, cv) => sum + cv.price, 0);

        let user = await User.findById(req.currentUser.userId);
    
        if (!user.name) {
            user.name = body.name;
            await user.save();
        }
        console.log(user)

        const customerFind = await Customer.findOne({userId : req.currentUser.userId})
        if(!customerFind){
            const newCustomerDoc = new Customer();
            newCustomerDoc.location = updateLocation;
            newCustomerDoc.userId = req.currentUser.userId
            await newCustomerDoc.save();
        }
        else {
        customerFind.location = updateLocation;
        await customerFind.save();
        }

        // Emit notification to experts if needed
        // io.emit('new-service-request', { message: 'New service request received!' });

        // Save service request and send response
        await serviceRequest.save();
        res.status(201).json(serviceRequest);
    } catch (err) {
        console.error("Error creating service request:", err);
        res.status(500).json({ errors: "Something went wrong" });
    }
};

serviceRequestCtlr.getAllServiceRequests = async (req, res) => {
    try {
        const search = req.query.search || '';
        const categorySearch = req.query.category || '';
        const status = req.query.status || '';
        const sort = req.query.sort || '';
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit 

        const pipeline = [
            { $lookup: { from: "users", localField: "customerId", foreignField: "_id", as: "customer"}},
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

            {$lookup: {from: "users",localField: "expertId", foreignField: "_id",as: "expert" }},
            { $unwind: { path: "$expert", preserveNullAndEmptyArrays: true } },

            {$lookup: { from: "categories", localField: "serviceType.category", foreignField: "_id", as: "categoryDetails"}},

            {$lookup: { from: "services", localField: "serviceType.servicesChoosen", foreignField: "_id", as: "servicesChoosenDetails"}}
        ];

        const matchStage = {};

        if (status)  matchStage.status = status;
        if (search) {
            matchStage.$or = [
                { "customer.name": { $regex: search, $options: "i" } },
                { "expert.name": { $regex: search, $options: "i" } }
            ];
        }

        if (categorySearch) matchStage["categoryDetails.name"] = { $regex: categorySearch, $options: "i" };

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        let sortOrder = {}
        if(sort === 'asc') sortOrder = { "budget.finalPrice" : 1}
        if(sort === 'desc') sortOrder = { "budget.finalPrice" : -1}

        if(sort) pipeline.push({ $sort : sortOrder})

        const totalDocuments = await ServiceRequest.countDocuments(matchStage);
        pipeline.push({ $skip : skip}, { $limit : limit})

        const serviceRequests = await ServiceRequest.aggregate(pipeline);
        console.log(serviceRequests)
        res.json({
            data : serviceRequests,
            totalPages : Math.ceil(totalDocuments / limit),
            currentPage : page,
            totalItems : totalDocuments,

        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

serviceRequestCtlr.getServiceRequest = async(req,res)=>{
    const {id} = req.params
    console.log(id)
    try{
        const serviceRequest = await ServiceRequest.findById(id)
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
        
        if(!serviceRequest){
            return res.status(404).json({errors : 'no service request is found'})
        }
        console.log(serviceRequest)
        res.json(serviceRequest)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}
      
serviceRequestCtlr.editServiceRequest = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const files = req.files;
    
    try {
        // console.log('body', body);
        // console.log('files', files);
        
        if(body.serviceType && typeof body.serviceType === 'string') {
            body.serviceType = JSON.parse(body.serviceType);
        }
        
        let uploadImages = [];
        if (req.files && req.files.length > 0) {
            uploadImages = files.map(file => ({
                pathName: file.path,          
                originalName: file.originalname 
            }));
        }
        console.log(uploadImages)
        
        const serviceRequest = await ServiceRequest.findOne({ _id: id });
        if (!serviceRequest) {
            return res.status(404).json({ errors: 'Service request not found' });
        }

        const existingImages = serviceRequest.serviceImages.map(img => img.originalName);
        const uniqueImages = uploadImages.filter(img => !existingImages.includes(img.originalName));

        console.log(existingImages)
        console.log(uniqueImages)


        if (Array.isArray(body.serviceType)) {
            for (const newServiceType of body.serviceType) {
                const categoryId = newServiceType.category;
                const newServices = newServiceType.servicesChoosen || [];

                const categoryExists = serviceRequest.serviceType.some(item => item.category.toString() === categoryId);
    
            if (categoryExists) {
                await ServiceRequest.updateOne(
                    { _id: id, 'serviceType.category': categoryId },
                    {
                        $addToSet: {
                            'serviceType.$.servicesChoosen': { $each: newServices },
                        },
                    }
                );
            } else {
                await ServiceRequest.updateOne(
                    { _id: id },
                    { $push: { serviceType: { category: categoryId, servicesChoosen: newServices } } }
                );
            }
        }
    } 

        const updatedServiceRequest = await ServiceRequest.findOneAndUpdate(
            { _id: id },
            {
                ...(uniqueImages.length > 0 && {
                        $addToSet: { serviceImages: { $each: uniqueImages } },
                    }),
                $set: {
                        location: body.location,
                        description: body.description,
                        scheduleDate: body.scheduleDate,
                },
            },
            { new: true }
        ); 


          return res.json(updatedServiceRequest); 
        } catch (err) {
          console.log('error', err);
          return res.status(500).json({ errors: 'Something went wrong' });
        }
      };

serviceRequestCtlr.updateStatus = async (req,res)=>{
    const id = req.params.id
    const body = req.body
    try{
        const serviceRequest = await ServiceRequest.findByIdAndUpdate(id, body, { new : true})
        if(!serviceRequest){
            return res.status(404).json({errors : 'service request is not found'})
        }
        if(body.status === 'assigned'){
            const expert = await Expert.findOne({userId : req.currentUser.userId})

            if (expert) {
                const scheduleDateFormatted = new Date(serviceRequest.scheduleDate)
                    .toISOString()
                    .split("T")[0];
            
                console.log("Formatted Schedule Date:", scheduleDateFormatted);
                
                expert.availability = expert.availability.filter(
                    (date) => date.split("T")[0] !== scheduleDateFormatted
                );
            
                await expert.save(); 
            }
            console.log("Updated Availability:", expert.availability);
            console.log("Service Request Date:", serviceRequest.scheduleDate);
        }

        //console.log(serviceRequest)
        res.json(serviceRequest)

    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

serviceRequestCtlr.getByCustomer = async (req,res)=>{
    try{        
        const {customerId} = req.params

        const { status } = req.query

        const query = { customerId }
        if(status){
            query.status = status
        }

        const serviceRequests = await ServiceRequest.find(query)
        res.json(serviceRequests)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

serviceRequestCtlr.getByExpert = async(req,res)=>{
    try{
        const { expertId } = req.params

        const { status } = req.query

        const query = { expertId }
        if(status){
            query.status = status
        }
        const serviceRequests = await ServiceRequest.find(query)
        res.json(serviceRequests)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

serviceRequestCtlr.onSiteService = async(req,res)=>{
    const { serviceRequestId, newService } = req.body
    console.log(serviceRequestId)
    try{
        const serviceRequest = await ServiceRequest.findById(serviceRequestId)

        if(!serviceRequest){
            return res.status(404).json({errors : 'service request not found'})
        }

        const newServiceEntry = {
            serviceName : newService.serviceName,
            price : newService.price
        }

        serviceRequest.onSiteServices.push(newServiceEntry)
        await serviceRequest.save()

        res.json(newServiceEntry)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

serviceRequestCtlr.deleteOnSiteService = async(req,res)=>{
    const serviceId = req.params.serviceId
    try{
        const serviceRequest = await ServiceRequest.findOne({"onSiteServices._id" : serviceId})

        if(!serviceRequest){
            return res.status(404).json({errors : 'on-site service not found'})
        }

        serviceRequest.onSiteServices = serviceRequest.onSiteServices.filter(
            (service) => service._id.toString() !== serviceId
        )

        await serviceRequest.save()

        return res.json(serviceId)

    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}   
    
export default serviceRequestCtlr