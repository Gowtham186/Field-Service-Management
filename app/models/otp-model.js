import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    identifier: {
        type : String
    },
    otpCode : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 1800 
    },
    purpose : {
        type : String,
        enum : ['login', 'resetPassowrd']
    }
})

const Otp = model('Otp', otpSchema)
export default Otp