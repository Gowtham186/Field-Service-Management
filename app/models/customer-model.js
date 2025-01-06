import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    name:{
        type:String
   },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address:{
        type:String
    },
    coords:{
        type:Object
    },
    location:{
        city : String, 
        state : String, 
        country : String
    },
    requestedServices : {
            type:[Schema.Types.ObjectId],
            //ref:'Service'
            default:[]
    },
    feedbacks:{
        type:[Schema.Types.ObjectId],
        // ref:'Service',
        default:[]
    },
}, { timestamps: true})
const Customer = model('Customer', customerSchema)
export default Customer