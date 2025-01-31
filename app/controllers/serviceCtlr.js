import Service from "../models/service-model.js"


const serviceCtlr = {}

serviceCtlr.deleteService = async (req,res)=>{
    const { serviceId } = req.params
    console.log('serviceCtlr')
    try{
        const service = await Service.findByIdAndDelete(serviceId)
        if(!service){
            return res.status(404).json({errors : 'service not found'})
        }
        res.json(service)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors: 'something went wrong'})
    }
}

serviceCtlr.deleteManyServices = async(req,res)=>{
    const { serviceIds } = req.body
    console.log('deletemany')
    try{
        const deleteServices = await Service.deleteMany({_id : { $in : serviceIds}})

        if(deleteServices.deletedCount === 0){
            return res.status(404).json({errors : 'No services found to delete'})
        }
        console.log(deleteServices)
        res.json({serviceIds})
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

export default serviceCtlr