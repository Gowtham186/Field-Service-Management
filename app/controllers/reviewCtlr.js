import { query } from "express"
import Review from "../models/review-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"

const reviewCtlr = {}

reviewCtlr.create = async (req,res)=>{
    const { body } = req
    try{
        const review = new Review({
            ...body,
            reviewer : req.currentUser.userId,
            reviewerModel : req.currentUser.role == 'customer' ? 'Customer' : 'Expert', 
        })

        review.revieweeModel = review.reviewerModel == 'Customer' ? 'Expert' : 'Customer'

        const service = await ServiceRequest.findOne({_id : review.serviceId})
        //console.log(service)

        review.reviewee = review.revieweeModel == 'Expert' ? service.expertId : service.customerId
    
        await review.save()
        
        res.status(201).json(review)
    }catch(err){    
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

reviewCtlr.getReviews = async (req,res)=>{
    try{
        const id = req.currentUser.userId
        const { type, serviceId } = req.query

        if(!type || (type != 'submitted' && type !== 'received')){
            return res.status(400).json({errors : 'Invalid type'})
        }

        const query = type === 'submitted' ? { reviewer : id } : { reviewee : id }

        if(serviceId){
            query.serviceId = serviceId
        }

        const reviews = await Review.find(query)
        res.json(reviews)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

export default reviewCtlr