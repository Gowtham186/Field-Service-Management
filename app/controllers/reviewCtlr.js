import Review from "../models/review-model.js"
import ServiceRequest from "../models/serviceRequest-model.js"
import User from "../models/user-model.js";

const reviewCtlr = {}

reviewCtlr.create = async (req, res) => {
    const { body } = req;

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

        // console.log(review);
        await review.save();

        res.status(201).json(review);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: "Something went wrong" });
    }
};

reviewCtlr.getReviews = async (req, res) => {
    const id = req.params.id;
    console.log('id', id)
    
    try {
        const reviews = await Review.find({ reviewee: id })

        const reviewsWithReviewer = await Promise.all(reviews.map(async (review) => {
            try {
                const reviewer = await User.findById(review.reviewer, 'name email');
                return {
                    ...review._doc,  
                    reviewer: reviewer ? reviewer : {}  
                };
            } catch (err) {
                console.error(`Error fetching reviewer details for review ID: ${review._id}`, err);
                return {
                    ...review._doc,
                    reviewer: {}  
                };
            }
        }));
        const expertReviews = reviewsWithReviewer
        return res.json(expertReviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        return res.status(500).json({ message: 'Error fetching reviews' });
    }
};



export default reviewCtlr