import axios from "axios"
import Customer from "../models/customer-model.js"

const customerCtlr = {}
customerCtlr.create = async(req,res)=>{
    const body = req.body
    try{
        const customer = new Customer(body)
        const existAddress = await Customer.findOne({address : body.address})
        if(!existAddress){
            const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params :{ q : body.address,  key : process.env.OPENCAGE_API_KEY }
            })
            //console.log(resource.data)
            if(resource.data.results.length > 0){
                customer.coords = resource.data.results[0].geometry
            }else{
                return res.status(400).json({errors : 'try other address'})
            }
        }else{
            customer.coords = existAddress.coords
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
export default customerCtlr