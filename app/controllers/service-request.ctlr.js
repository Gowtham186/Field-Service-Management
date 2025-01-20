import Customer from "../models/customer-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"
import Service from "../models/service-model.js"


const serviceRequestCtlr = {}

serviceRequestCtlr.create = async (req, res) => {
    const body = req.body;

    try {
        // console.log(req.files);
        // console.log(body);
        
        if (body.serviceType && typeof body.serviceType === 'string') {
            body.serviceType = JSON.parse(body.serviceType);
        }
        
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(file => ({
                pathName: file.path,
                originalName: file.originalname, 
            }));
            body.serviceImages = uploadImages;
        }

        const service = new ServiceRequest(body)
        service.customerId = req.currentUser.userId;
        
        const customerLocation = await Customer.findOne({ userId: req.currentUser.userId });
        if (!customerLocation) {
            return res.status(404).json({ errors: "Customer not found" });
        }
        service.location.address = customerLocation.location.address;
        service.location.city = customerLocation.location.city;
        service.budget.bookingFee = 50;
        
        const selectedServices = service.serviceType.map(ele => ele.servicesChoosen).flat()

        const findPrices = await Promise.all(
            selectedServices.map(async(serviceId) => {
            return Service.findOne({_id : serviceId})
            })
        )
        // console.log(findPrices)
    
        const totalPrice = findPrices.reduce((acc, cv) => acc + cv.price, 0)
        //console.log(totalPrice)
        service.budget.servicePrice = totalPrice
        service.budget.finalPrice = totalPrice + service.budget.bookingFee
        
        const customer = await Customer.findOneAndUpdate(
            {userId : req.currentUser.userId},
            {
                $push : { requestedServices : service }
            },
            {new : true}
        )
        console.log(customer)


        //console.log(service)
        await service.save();
        
        res.status(201).json(service);
    } catch (err) {
        console.error("Error creating service request:", err);
        res.status(500).json({ errors: "Something went wrong" });
    }
};

serviceRequestCtlr.getAllServiceRequests = async (req,res)=>{
    try{
        const allServiceRequests = await ServiceRequest.find()
        
        res.json(allServiceRequests)
    }catch(err){
        
    }
}

serviceRequestCtlr.getServiceRequest = async(req,res)=>{
    const id = req.params.id
    try{
        const serviceRequest = await ServiceRequest.findById(id)
        .populate('serviceType.category', 'name')
        .populate('serviceType.servicesChoosen', 'serviceName')
        
        if(!serviceRequest){
            return res.status(404).json({errors : 'no service request is found'})
        }

        res.json(serviceRequest)
    }catch(err){
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
      
    
    

export default serviceRequestCtlr