import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
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
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
