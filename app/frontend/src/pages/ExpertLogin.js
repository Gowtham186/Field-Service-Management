import { Link } from "react-router-dom";
import ExpertRegister from "./ExpertRegister";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { expertLogin } from "../redux/slices.js/user-slice";
import validator from 'validator'

export default function ExpertLogin(){
    const [formData, setFormData] = useState({
        email:'',
        password:''
    })
    const [clientErrors, setClientErrors] = useState({})
    const dispatch = useDispatch()
    const errors = {}

    const runClientValidations = ()=>{
        if (!formData.email) {
            errors.email = "Email is required";
          } else if (!validator.isEmail(formData.email)) {
            errors.email = "Email should be in valid format";
          }
      
          if (!formData.password) {
            errors.password = "Password is required";
          } else if (!validator.isStrongPassword(formData.password)) {
            errors.password =
              "Password must contain at least 8 characters, 1 uppercase letter, and 1 special character";
          }
    }

    const handleExpertLogin = (e)=>{
        e.preventDefault()
        runClientValidations()
        console.log(formData)
        const resetForm = ()=> setFormData({email : '', password : ''})
        if(Object.keys(errors).length !== 0){
            setClientErrors(errors)
        }else{
            setClientErrors({})
            dispatch(expertLogin({formData, resetForm}))
        }
    }
    return(
        <>
            <h1>ExpertLogin</h1>
            <form onSubmit={handleExpertLogin}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input 
                    type="email"
                    id="email"
                    value={formData.email}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e)=> {
                        setFormData({...formData, email : e.target.value})
                        setClientErrors({...clientErrors, email : null})
                    }}
                    />
                {clientErrors && (
                    <p className="text-red-500 text-xs">{clientErrors.email}</p>
                )}
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                <input 
                    type="password"
                    id="passowrd"
                    value={formData.password}
                    onChange={(e)=> {
                        setFormData({...formData, password : e.target.value})
                        setClientErrors({...clientErrors, password : null})
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {clientErrors && (
                        <p className="text-red-500 text-xs">{clientErrors.password}</p>
                    )}
                    <button
                    type="submit"
                    className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Login
                    </button>
            </form>
            <Link to="/expertregister"><ExpertRegister /></Link>
        </>
    )
}