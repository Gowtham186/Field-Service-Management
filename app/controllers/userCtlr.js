import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from "../models/user-model.js";
import { generateOtp } from "../utils.js/otphelper.js";
import { sendSMS } from "../utils.js/sendSMS.js";
import { validationResult } from 'express-validator';
import Otp from '../models/otp-model.js';
import { comparePassword, hashPassword } from '../utils.js/hashPassword.js'
const userCtlr = {}

userCtlr.register = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const body = req.body
    try{
        if(body.password){
            const salt = await bcryptjs.genSalt()
            const hashedPassword = await bcryptjs.hash(body.password, salt)
            body.password = hashedPassword
        }
        const user = await User.create(body)

        const token = jwt.sign({ userId : user?._id, role: user?.role}, process.env.SECRET_KEY, {expiresIn : '7d'})
        return res.json({token : `Bearer ${token}`})    
        //res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.login = async (req, res) => {
    try {
        const { phone_number, email, password } = req.body;
        let user;

        if (phone_number) {
            user = await User.findOne({ phone_number });

            if (!user) {
                user = new User({ phone_number }); 
            }

            const otp = generateOtp();
            await Otp.create({
                identifier: phone_number,
                otpCode: otp,
                purpose: 'login',
                createdAt: new Date(),
            });

            await user.save();
            await sendSMS(phone_number, otp);

            return res.json({ message: 'OTP sent successfully' });
        }

        // expert/Admin Login using Email
        if (email) {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ errors: 'Invalid email' });
            }

            const isValidUser = await bcryptjs.compare(password, user.password);
            if (!isValidUser) {
                return res.status(400).json({ errors: 'Invalid password' });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.SECRET_KEY,
                { expiresIn: '7d' }
            );

            return res.json({ token: `Bearer ${token}` });
        }

        return res.status(400).json({ error: 'Invalid request' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtlr.verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        console.log({ identifier, otp });

        const findOtp = await Otp.findOne({ identifier }).sort({ createdAt: -1 });

        if (!findOtp) {
            return res.status(400).json({ error: 'Invalid OTP or OTP expired' });
        }

        const otpAge = (Date.now() - findOtp.createdAt) / 1000; // Convert to seconds
        if (otpAge > 300) { // 300 seconds = 5 minutes
            await Otp.deleteOne({ _id: findOtp._id });
            return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
        }

        if (findOtp.otpCode !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const user = await User.findOne({ phone_number: identifier });
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '7d' }
        );

        await Otp.deleteOne({ _id: findOtp._id });

        return res.json({ message: 'OTP verified successfully', token: `Bearer ${token}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


userCtlr.adminLogin = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const { email, password } = req.body
    try{
        const admin = await User.findOne({email})
        if(!admin){
            return res.status(404).json({errors : 'invalid email'})
        }
        const passwordVerify =  bcryptjs.compare(password, admin.password)
        if(!passwordVerify){
            return res.status(400).json({errors : 'invalid password'})
        }

        const token =  jwt.sign({userId:admin._id, role:admin.role}, process.env.SECRET_KEY, {expiresIn : '7d'})
        res.json({token : `Bearer ${token}`})
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.profile = async (req,res)=>{
    try{
        const user = await User.findById(req.currentUser.userId)
        //console.log(req.currentUser.userId)
        if(!user){
            return res.status(404).json({errors : 'record not found'})
        }
        return res.json(user)
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.updateUser = async(req,res)=>{
    const body = req.body
    try{
        const userId = req.currentUser.userId
        const updatedUser = await User.findByIdAndUpdate(userId, body , { new : true})
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User updated:", updatedUser);
        return res.status(200).json(updatedUser);
    }catch(err){
        console.log(err)
        return res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.resetPassword = async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
      console.log({ email, oldPassword, newPassword })
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User with this email does not exist." });
      }
  
      if (!(await comparePassword(oldPassword, user.password))) {
        return res.status(400).json({ error: "Incorrect old password." });
      }
  
      if (oldPassword === newPassword) {
        return res.status(400).json({ error: "New password cannot be the same as the old password." });
      }
  
      user.password = await hashPassword(newPassword);
      await user.save();
  
      return res.status(200).json({ message: "Password has been updated successfully." });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
}

export default userCtlr