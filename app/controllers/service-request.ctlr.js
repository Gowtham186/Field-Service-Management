import Customer from "../models/customer-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"
import Service from "../models/service-model.js"
import Expert from "../models/expert-model.js"
import axios from "axios"
import geolib, { getDistance } from 'geolib'
import Category from "../models/category-model.js"
//import { io } from "../../index.js"

const serviceRequestCtlr = {}

serviceRequestCtlr.create = async (req, res) => {
    const body = req.body;

    try {
        // console.log(req.files);
        //console.log(body);
        const customerDoc = await Customer.findOne({userId : req.currentUser.userId}).populate('userId')
        //console.log(customerDoc)

        
        if (body.serviceType && typeof body.serviceType === 'string') {
            body.serviceType = JSON.parse(body.serviceType);
        }
        if(body.location && typeof body.location == 'string'){
            body.location = JSON.parse(body.location)
        }
        
        const invalidService = body.serviceType.some(({servicesChoosen}) => !servicesChoosen.length)
        if(invalidService){
            return res.status(400).json({errors: 'choose a service'})
        }
        
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(file => ({
                pathName: file.path,
                originalName: file.originalname, 
            }));
            body.serviceImages = uploadImages;
        }
        
        let lat, lng
        const customerLocation = await Customer.findOne({ 'location.address' : body.location.address})
        if(!customerLocation){
            const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params :{ q : body.location.address,  key : process.env.OPENCAGE_API_KEY }
            })
            //console.log(resource.data.results[0].geometry)
            const geometry = resource.data.results[0].geometry
            lat = geometry.lat
            lng = geometry.lng
            console.log({lat, lng})
        }else{
            const geometry = customerLocation.location.coords
            lat = geometry.lat
            lng = geometry.lng
            //console.log('old', {lat, lng})
        }
        
        const experts = await Expert.find()

        const filteredExperts = experts.filter(expert => {
            if(!expert.location.coords || !expert.location.coords.lat || !expert.location.coords.lng){
                return false
            }
            //console.log(expert.location.coords)
            return geolib.isPointWithinRadius(
                { latitude : expert.location.coords.lat, longitude : expert.location.coords.lng},
                { latitude : lat, longitude : lng},
                10000
            )
        })
        console.log(filteredExperts)

        
        const updateLocation = { address : body.location.address, coords : { lat, lng }}
        
        const serviceRequest = new ServiceRequest({
            ...body,
            customerId : req.currentUser.userId,
            location : updateLocation,
            budget : { bookingFee : 50 },
        })
        
        const selectedServices = body.serviceType.flatMap(({servicesChoosen}) => servicesChoosen)
        const servicePrices = await Promise.all(selectedServices.map(id => Service.findById(id)))
        
        serviceRequest.budget.servicePrice = servicePrices.reduce((sum, cv) => sum + cv.price, 0)
        serviceRequest.budget.finalPrice = serviceRequest.budget.servicePrice + serviceRequest.budget.bookingFee
        
        if(!customerDoc){
            const newCustomerDoc = new Customer()
            newCustomerDoc.location = updateLocation
            await newCustomerDoc.save()
            //console.log('new')
        }else{
            customerDoc.location = updateLocation
            await customerDoc.save()
            //console.log('old')
        }

        // filteredExperts.forEach(expert => {
        //     if(expert.socketId){
        //         io.to(expert.socketId).emit('new-service-request', {
        //             requestedId : serviceRequest._id,
        //             customerLocation : { lat, lng },
        //             serviceCategory : body.serviceType
        //         })
        //     }
        // })

        /* console.log('Notification sent to filtered experts.')

            io.emit('new-service-request', { message: 'New service request received!' }, (ack) => {
                if (ack) {
                    console.log('Client acknowledged receipt of event');
                } else {
                    console.error('Client did not acknowledge event');
                }
            });
            
             */console.log('Event emitted: new-service-request');
            

        //console.log(serviceRequest)
        //await serviceRequest.save();
        
        res.status(201).json(serviceRequest);
    } catch (err) {
        console.error("Error creating service request:", err);
        res.status(500).json({ errors: "Something went wrong" });
    }
};

serviceRequestCtlr.getAllServiceRequests = async (req,res)=>{
    try{
        let allServiceRequests = await ServiceRequest.find()
        if(req.currentUser.role == 'expert'){
            const expert = await Expert.findOne({userId : req.currentUser.userId})
            //allServiceRequests = allServiceRequests.map(serviceRequest => serviceRequest.serviceType).flat().filter(serviceType => expert.categories.includes(serviceType.category))
            
            allServiceRequests = allServiceRequests.filter(serviceRequest =>
                serviceRequest.serviceType.some(serviceType => expert.categories.includes(serviceType.category)
                )
            );
        } 
        
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

serviceRequestCtlr.updateStatus = async (req,res)=>{
    const id = req.params.id
    const body = req.body
    try{
        let serviceRequest = await ServiceRequest.findById(id)
        if(!serviceRequest){
            return res.status(404).json({errors : 'service request is not found'})
        }

        const expert = await Expert.findOne({userId : req.currentUser.userId})
        if(!expert){
            return res.status(404).json({errors : 'something went wrong'})
        }

        if(body.status == 'assigned'){
            if(expert.isVerified == false){
                return res.status(401).json({errors : 'sorry your account should be verified before select a service'})
            }
    
            const serviceDate = new Date(serviceRequest.scheduleDate)
            serviceDate.setHours(0,0,0,0)
    
            const isAvailableDate = !expert.availability.some(ele => {
                const singleDateObj = new Date(ele.date)
                singleDateObj.setHours(0,0,0,0)
                return singleDateObj.getTime() === serviceDate.getTime()
            })
    
            console.log(isAvailableDate)
            if(!isAvailableDate){
                return res.status(400).json({errors : 'you have scheduled service on this date'})
            }
        }
        
        serviceRequest = await ServiceRequest.findOneAndUpdate(
            {_id : id},
            { $set : { status : body.status, expertId : req.currentUser.userId}},   
            {new : true}
        )
        const updateExpert = await Expert.findOneAndUpdate(
            {userId : req.currentUser.userId},
            {
                $addToSet: {
                  availability: {
                    $each: [
                      {
                        date: serviceRequest.scheduleDate,
                        serviceId: serviceRequest
                      }
                    ]
                  }
                }
              },
            {new : true}
        )
        //console.log(updateExpert)
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

/* serviceRequestCtlr.querying = async (req, res) => {
    try {
      const { location } = req.query;
  
      if (!location) {
        return res.status(400).json({ errors: 'Location is required' });
      }
  
      let results = await Expert.find({ location }).select('categories').populate('categories', 'name');
  
      if (!results.length) {
        return res.status(404).json({ errors: 'No results found for this specified location' });
      }

      if (category) {
        results = results.filter(expert => 
          expert.categories.some(cat => cat.name === category)
        );
  
        if (!results.length) {
          return res.status(404).json({ errors: `No results found for category '${category}' in the specified location` });
        }
      }
      
      const allCategories = results.flatMap(expert => expert.categories.map(cat => cat.name))

      const uniqueCategories = []
      allCategories.forEach(category => {
        if(!uniqueCategories.includes(category)){
            uniqueCategories.push(category)
        }
      })
    
      res.json(uniqueCategories);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: 'Something went wrong' });
    }
  }; */
  

// serviceRequestCtlr.querying = async(req,res)=>{
//     try{
//         const { location } = req.query
//         console.log(location)

//         const existAddress = await Customer.findOne({'location.address' : location})

//         let lat, lng;
//         if(!existAddress){
//             const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
//                 params :{ q : location,  key : process.env.OPENCAGE_API_KEY }
//             })

            
//             if(resource.data.results.length == 0){
//                 return res.status(400).json({errors : 'try other address'})
//             }
            
//             const geometry = resource.data.results[0].geometry
//             lat = geometry.lat
//             lng = geometry.lng
//             console.log('new', {lat,lng})
//         }else{
//             const geometry = existAddress.location.coords
//             lat = geometry.lat
//             lng = geometry.lng
//             console.log('old', {lat,lng})
//         }
//         //console.log({lat, lng})
//         //res.json({lat, lng})

//         const experts = await Expert.find()
//         console.log(experts.length)

//         const filteredExperts = experts.filter(expert => {
//             if(!expert.location.coords || !expert.location.coords.lat || !expert.location.coords.lng){
//                 return false
//             }
//             //console.log(expert.location.coords)
//             return geolib.isPointWithinRadius(
//                 { latitude : expert.location.coords.lat, longitude : expert.location.coords.lng},
//                 { latitude : lat, longitude : lng},
//                 10000
//             )

//             /* return distane = geolib.getDistance(
//                 { latitude : expert.location.coords.lat, longitude : expert.location.coords.lng},
//                 { latitude : lat, longitude : lng}
//             )
//             console.log(distane) */
//         })

//         // if(filteredExperts.length == 0){
//         //     return res.status(404).json({errors : 'No experts found withing 5km radius'})
//         // }
//         console.log(filteredExperts)

//         // const allSkillIds = filteredExperts.flatMap(expert => expert.skills.map(cat => cat))
//         // const uniqueSkillIds = allSkillIds.filter((id, index, self)=> self.indexOf(id) === index)
        
//         // console.log(allSkillIds)
//         // console.log(uniqueSkillIds)

//         // const skills = await Skill.find({_id : { $in : uniqueSkillIds}}).select('name')
//         // console.log(skills)

//         res.json(filteredExperts)

//     }catch(err){
//         console.log(err)
//         return res.status(500).json({errors : 'something went wrong'})
//     }
// }

serviceRequestCtlr.querying = async (req, res) => {
    try {
        const { location } = req.query;
        console.log(location);

        let lat, lng;
        const existAddress = await Customer.findOne({ 'location.address': location });

        if (!existAddress) {
            const resource = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: { q: location, key: process.env.OPENCAGE_API_KEY }
            });

            if (resource.data.results.length === 0) {
                return res.status(400).json({ errors: 'Try another address' });
            }

            const geometry = resource.data.results[0].geometry;
            lat = geometry.lat;
            lng = geometry.lng;
            console.log('New Location:', { lat, lng });

        } else {
            const geometry = existAddress.location.coords;
            lat = geometry.lat;
            lng = geometry.lng;
            console.log('Existing Location:', { lat, lng });
        }

        // **Find experts near the given location (10 km radius)**
        const experts = await Expert.find({
            'location.coords': { $exists: true }  // Ensure experts have location data
        });

        console.log(`Total Experts: ${experts}`);

        const filteredExperts = experts.filter(expert => {
            if (!expert.location.coords || !expert.location.coords.lat || !expert.location.coords.lng) {
                return false;
            }

            const distance = geolib.getDistance(
                { latitude: expert.location.coords.lat, longitude: expert.location.coords.lng },
                { latitude: lat, longitude: lng }
            );

            console.log(`Distance to ${expert.name}: ${distance} meters`);

            return distance <= 10000; // 10 km radius
        });

        console.log(`Filtered Experts: ${filteredExperts.length}`);

        res.json(filteredExperts);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ errors: 'Something went wrong' });
    }
};

  
export default serviceRequestCtlr