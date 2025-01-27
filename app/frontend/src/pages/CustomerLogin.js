import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import validator from 'validator'
import { customerLogin, verifyOtpApi } from "../redux/slices.js/user-slice"
export default function CustomerLogin(){
    const [phone_number, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [clientErrors, setClientErrors] = useState({})
    const dispatch = useDispatch()
    const errors = {}
    const { serverError } = useSelector((state)=> state.user)

    const runClientValidations = ()=>{
        if(!phone_number){
            errors.phone_number = 'phone number is required'
        }else if(!validator.isNumeric(phone_number)){
            errors.phone_number = 'Phone number should start with only 9, 8, 7, or 6 and be 10 digits long';
        }
        else if(phone_number.trim().length > 0 && phone_number.length < 10){
            errors.phone_number = 'phone number must contain 10 digits only'
        }
    }
    const otpClientValidations = ()=> {
        if(!otp){
            errors.otp = 'otp is required'
        }else if(!validator.isNumeric(phone_number)){
            errors.otp = 'otp should only numbers';
        }else if(otp.length !==4) {
            errors.otp = 'OTP must be 4 digits'
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        runClientValidations()
        console.log(errors)
        const formData = {
            phone_number 
        }
        console.log(formData)
        if(Object.keys(errors).length !== 0){
            setClientErrors(errors)
        }else{
            setClientErrors({})
            dispatch(customerLogin(formData))
        }
    }

    const verifyOtp = (e)=>{
        e.preventDefault()
        otpClientValidations()
        const verifyOtpData = { 
            identifier : phone_number,
            otp : otp
        }
        const resetForm = ()=>{
            setPhoneNumber('')
            setOtp('')
        }
        console.log(verifyOtpData)
        if(Object.keys(errors).length !== 0){
            setClientErrors(errors)
        }else{
            setClientErrors({})
            dispatch(verifyOtpApi({verifyOtpData, resetForm}))
        }
    }

    return(
        <> 
            <h1>CustomerLogin</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Enter Phone Number :</label>
                    <input 
                        type="text"
                        id="phone_number"
                        value={phone_number}
                        onChange={(e)=> {
                            setPhoneNumber(e.target.value)
                            setClientErrors((prevErrors) => ({...prevErrors, phone_number : null}))
                        }}
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    {clientErrors && <p style={{color:'red'}}>{clientErrors.phone_number}</p>}
                </div>
                <button
                type="submit"
                className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Send OTP
                 </button>
            </form>

            <form onSubmit={verifyOtp}>
                <label htmlFor="otp" className="text-md font-medium" >Enter otp :</label>
                <input 
                    type = 'text'
                    id="otp"
                    value={otp}
                    onChange={(e)=> {
                        setOtp(e.target.value)
                    }}            
                    maxLength={4}
                    className="w-20 text-center text-xl border rounded-lg shadow focus:outline-none focus:ring focus:ring-indigo-500"
                    placeholder="_ _ _ _"
                />
                {clientErrors && <p style={{color:'red'}}>{clientErrors.otp}</p>}
                {serverError && <p style={{color : 'red'}}>{serverError}</p>}
                <button
                type="submit"
                className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                verify Otp
                </button>
            </form>
        </>
    )
}