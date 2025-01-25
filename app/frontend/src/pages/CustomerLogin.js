import { useState } from "react"
import { useDispatch } from "react-redux"
import { customerLogin, verifyOtpApi } from "../redux/slices.js/user-slice"
export default function CustomerLogin(){
    const [phone_number, setPhoneNumber] = useState(null)
    const [otp, setOtp] = useState("")

    const dispatch = useDispatch()

    const handleSubmit = (e)=>{
        e.preventDefault()
        const formData = {
            phone_number 
        }
        console.log(formData)
        dispatch(customerLogin(formData))
    }

    const verifyOtp = (e)=>{
        e.preventDefault()
        const verifyOtpData = { 
            identifier : phone_number,
            otp : otp
        }
        console.log(verifyOtpData)
        dispatch(verifyOtpApi(verifyOtpData))
    }

    return(
        <> 
            <h1>CustomerLogin</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                    <input 
                        type="text"
                        id="phone_number"
                        value={phone_number}
                        onChange={(e)=> setPhoneNumber(e.target.value)}
                        className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                        />
                </div>
                <button
                type="submit"
                className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Submit
                 </button>
            </form>

            <form onSubmit={verifyOtp}>
                <label htmlFor="otp" className="text-md font-medium" >Enter otp :</label>
                <input 
                    type = 'text'
                    id="otp"
                    value={otp}
                    onChange={(e)=> setOtp(e.target.value)}            
                    maxLength={4}
                    className="w-20 text-center text-xl border rounded-lg shadow focus:outline-none focus:ring focus:ring-indigo-500"
                    placeholder="_ _ _ _"
                />
                <button
                type="submit"
                className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                verify Otp
                 </button>
            </form>
        </>
    )
}