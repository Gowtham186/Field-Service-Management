import { Schema, model } from 'mongoose'

const reviewSchema = new Schema({
   rating:{
        type : Number,
        min : 1,
        max : 5
   },
   comment : { type : String},
   serviceId : { type : Schema.Types.ObjectId },
   reviewer : {
        type : Schema.Types.ObjectId,
        refPath : 'reviewerModel'
   },
   reviewerModel : {
        type : String,
        enum : [ 'Customer', 'Expert']
   },
   reviewee : {
        type : Schema.Types.ObjectId,
        refPath : 'revieweeModel'
   },
   revieweeModel : {
        type : String,
        enum : ['Customer', 'Expert']
   },
   reviewDate : { 
        type : Date, 
        default : Date.now
    }
},{timestamps : true})
const Review = model('Review', reviewSchema)
export default Review