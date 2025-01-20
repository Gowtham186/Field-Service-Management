import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    category : {
        type : Schema.Types.ObjectId,
        ref : 'Category'
    },
    serviceName : String,
    price : Number
}, {timestamps : true})

const Service = model('Service', serviceSchema)
export default Service