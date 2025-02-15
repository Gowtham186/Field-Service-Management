import { query } from "express"
import Review from "../models/review-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"

const reviewCtlr = {}

reviewCtlr.create = async (req, res) => {
    const { body } = req;
    console.log(body);

    try {
        const service = await ServiceRequest.findOne({ _id: body.serviceRequestId });

        if (!service) {
            return res.status(404).json({ errors: "Service request not found" });
        }

        const reviewerRole = req.currentUser.role;
        const reviewee = reviewerRole === 'customer' ? service.expertId : service.customerId;

        const review = new Review({
            ...body,
            reviewer: req.currentUser.userId,
            reviewee
        });

        console.log(review);
        await review.save();

        res.status(201).json(review);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: "Something went wrong" });
    }
};

reviewCtlr.getReviews = async(req,res) => {
    const id = req.params.id
    try{
        const reviews = await Review.find({reviewee : id})
        console.log(reviews)
        return res.json(reviews)
    }catch(err){
        
    }
}

export default reviewCtlr