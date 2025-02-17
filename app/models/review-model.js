import { Schema, model } from 'mongoose'

const reviewSchema = new Schema({
   rating:{
        type : Number,
        min : 1,
        max : 5
   },
   reviewText : { type : String},
   serviceRequestId : { type : Schema.Types.ObjectId },
   reviewer : {
        type : Schema.Types.ObjectId,
        refPath : 'User'
   },
   reviewee : {
        type : Schema.Types.ObjectId,
        refPath : 'User'
   },
   reviewDate : { 
        type : Date, 
        default : Date.now
    }
},{timestamps : true})
const Review = model('Review', reviewSchema)
export default Review