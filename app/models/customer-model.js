import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    name:{
        type:String
   },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location:{
        city : String,
        address:String,
        coords:Object
    }
}, { timestamps: true})
const Customer = model('Customer', customerSchema)
export default Customer