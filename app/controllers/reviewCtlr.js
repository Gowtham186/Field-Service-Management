import { query } from "express"
import Review from "../models/review-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"

const reviewCtlr = {}

reviewCtlr.create = async (req,res)=>{
    const { body } = req
    console.log(body)
    try{
        const review = new Review({
            ...body,
            reviewer : req.currentUser.userId,
        })
        
        const reviewerModel = req.currentUser.role == 'customer' ? 'Customer' : 'Expert' 
        const revieweeModel = reviewerModel === 'Customer' ? 'Expert' : 'Customer'

        const service = await ServiceRequest.findOne({_id : review.serviceRequestId})
        // console.log(service)

        review.reviewee = revieweeModel == 'Expert' ? service.expertId : service.customerId
    
        console.log(review)
        await review.save()
        
        res.status(201).json(review)
    }catch(err){    
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

// reviewCtlr.getReviews = async (req,res)=>{
//     try{
//         const id = req.params
//         const { type, serviceId } = req.query

//         if(!type || (type != 'submitted' && type !== 'received')){
//             return res.status(400).json({errors : 'Invalid type'})
//         }

//         const query = type === 'submitted' ? { reviewer : id } : { reviewee : id }

//         if(serviceId){
//             query.serviceId = serviceId
//         }

//         const reviews = await Review.find(query)
//         res.json(reviews)
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({errors : 'something went wrong'})
//     }
// }

reviewCtlr.getReviews = async(req,res) => {
    const id = req.params.id
    console.log('sdkjfnm',id)
    try{
        const reviews = await Review.find({reviewee : id})
        console.log(reviews)
        return res.json(reviews)
    }catch(err){
        
    }
}

export default reviewCtlr