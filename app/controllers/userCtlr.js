import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from "../models/user-model.js";
import { generateOtp } from "../utils.js/otphelper.js";
import { sendSMS } from "../utils.js/sendSMS.js";
import { validationResult } from 'express-validator';
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
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.login = async(req,res)=>{
    try{
        const { phone_number } = req.body

        const user = await User.findOne({phone_number})
        if(!user){
            return res.status(404).json({errors : 'invalid phone number'})
        }

        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        //console.log(otp)
        user.otp  = { code:otp, expiresAt}
        await user.save()
        
        //await sendSMS(phone_number, otp)

        res.json({message : 'otp sent successfully', otp:otp})
        
    }catch(err){
        console.log(err)
        res.status(500).json({errors : 'something went wrong'})
    }
}

userCtlr.verifyOtp = async(req,res)=>{
    const { phone_number, otp } = req.body
    try{
        const user = await User.findOne({phone_number})

        if(!user){
            return res.status(404).json({errors: 'invalid phone number'})
        }
        //console.log(user.otp.code)
        if(user.otp.code != otp){
            return res.status(400).json({errors : 'invalid otp'})
        }
        
       /*  if(user.otp.expiresAt < new Date()){
            return res.status(400).json({errors : 'otp has expired'})
        } */

        const token = jwt.sign({userId: user._id, role:user.role}, process.env.SECRET_KEY, { expiresIn : '7d'})
        return res.json({message:'otp has verified successfully', token : `Bearer ${token}`})
        
    }catch(err){
        res.status(500).json({errors : 'something went wrong'})
    }
}

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


export default userCtlr