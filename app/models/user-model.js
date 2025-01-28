import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name:{
      type:String
    },
    phone_number: {
      type: Number
    },
    email: {
      type: String
    },
    password: String,
    role: {
      type: String,
      default: "customer",
      enum:['customer', 'expert', 'admin']
    }
  },{ timestamps: true });

const User = model("User", userSchema);
export default User;
