import axios from "axios"
import Customer from "../models/customer-model.js"
import ServiceRequest from '../models/serviceRequest-model.js'

const customerCtlr = {}
customerCtlr.create = async(req,res)=>{
    const body = req.body
    try{
        const customer = new Customer(body)
        const existAddress = await Customer.findOne({address : body.address})
        if(!existAddress){
            const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params :{ q : body.location.address,  key : process.env.OPENCAGE_API_KEY }
            })
            //console.log(resource.data)
            if(resource.data.results.length > 0){
                customer.location.coords = resource.data.results[0].geometry
            }else{
                return res.status(400).json({errors : 'try other address'})
            }
        }else{
            customer.location.coords = existAddress.location.coords
        }
        
        customer.userId = req.currentUser.userId
        //console.log(customer)
        await customer.save()
        res.json(customer)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

customerCtlr.profile = async(req,res)=>{
    const id = req.params.id
    console.log(id)
    try{
        const customer = await Customer.findOne({userId:id})
        if(!customer){
            return res.status(404).json({errors : 'no customer found'})
        }
        res.json(customer)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

customerCtlr.update = async(req,res)=>{
    try{
        const id = req.params.id
        const body = req.body
        const customer = await Customer.findByIdAndUpdate(id, body, { new : true, runValidators : true})
        if(!customer){
            return res.status(404).json({errors : 'record not found'})
        }
        res.json(customer)
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

customerCtlr.myBookings = async(req,res)=>{
    try{
        const myBookings = await ServiceRequest.find({customerId : req.currentUser.userId})
            .populate('expertId')
            .populate({
                path: "serviceType.category",
                model: "Category", 
                select: "name",
            })
            .populate({
            path: "serviceType.servicesChoosen",
            model: "Service", 
            select: "serviceName price", 
            })
        res.json(myBookings)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

customerCtlr.saveBookings = async (req, res) => {
    const { id } = req.params; // Customer user ID
    const { expertId, selectedServices } = req.body;
    console.log(req.body)
    try {
        const customer = await Customer.findOneAndUpdate(
            { userId: id }, // Find by userId
            {
                $set: {
                    "savedBookings.expertId": expertId,
                    "savedBookings.selectedServices": selectedServices
                }
            },
            { new: true, upsert: true } // Create new if not exists
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        console.log(customer.savedBookings)
        res.json(customer.savedBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Could not save bookings." });
    }
};


export default customerCtlr