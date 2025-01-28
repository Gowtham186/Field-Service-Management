import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import validator from 'validator'
import { expertRegister } from "../redux/slices.js/user-slice"
import { useNavigate } from "react-router-dom"
import ExpertCreation from "./ExpertCreation"

const formInitialState = {
    name : '',
    phone_number : '',
    email : '',
    password : '',
    role : 'expert'
}
export default function ExpertRegister(){
    const [formData, setFormData] = useState(formInitialState)
    const [clientErrors, setClientErrors] = useState({})
    const errors = {}
    const dispatch = useDispatch()
    const { serverError } = useSelector((state)=> state.user)
    const navigate = useNavigate()
    const [openExpertForm, setOpenExpertForm] = useState(false)


    const runClientValidations = ()=>{
        if (!formData.name) {
            errors.name = 'Name is required';
        } else if (!validator.isAlpha(formData.name)) {
            errors.name = 'Name should not contain numbers or special characters';
        }
    
        if(!formData.email){
            errors.email = 'Email is required'
        }else if(!validator.isEmail(formData.email)){
            errors.email = 'Email should be in valid format'
        }
    
        if (!formData.phone_number) {
            errors.phone_number = 'Phone number is required';
        } else if (!validator.isNumeric(formData.phone_number)) {
            errors.phone_number = 'Phone number should contain only numeric digits';
        } else if (!/^[9876]\d{9}$/.test(formData.phone_number)) {
            errors.phone_number = 'Phone number should start with 9, 8, 7, or 6 and be 10 digits long';
        }        
    
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!validator.isStrongPassword(formData.password)) {
            errors.password = 'Password must contain at least 8 characters, 1 uppercase letter, and 1 special character';
        }
        
    }
    const handleRegister = async (e)=> {
        e.preventDefault()
        runClientValidations()
        console.log(formData)
        const resetForm = ()=> setFormData(formInitialState) 
        if(Object.keys(errors).length !== 0){
            setClientErrors(errors)
        }else{
            try{
                setClientErrors({})
                await dispatch(expertRegister({formData, resetForm})).unwrap()
                setOpenExpertForm(true)
                navigate('/create-expert')
            }catch(err){
                console.log('Error registering expert', err)
            }
        }
    }
    return(
        <div>
            <h1>ExpertRegister</h1>
            <form onSubmit={handleRegister}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name :</label>
                <input 
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e)=> {
                        setFormData({...formData, name : e.target.value})
                        setClientErrors({...clientErrors, name : null})
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.name}</p>)}
                {serverError && serverError.length > 0 && 
                    serverError
                        .filter(ele => ele.path === 'name')
                        .map((ele, i)=>( <p key={i} className="text-red-500 text-xs">{ele.msg}</p>))
                }

                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number :</label>
                <input 
                    type="text"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e)=> {
                        setFormData({...formData, phone_number : e.target.value})
                        setClientErrors({...clientErrors, phone_number : null})
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.phone_number}</p>)}
                {serverError && serverError.length > 0 && 
                    serverError
                        .filter(ele => ele.path === 'phone_number')
                        .map((ele, i)=>( <p key={i} className="text-red-500 text-xs">{ele.msg}</p>))
                }
                
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
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.email}</p>)}
                {serverError && serverError.length > 0 && 
                    serverError
                        .filter(ele => ele.path === 'email')
                        .map((ele, i)=>( <p key={i} className="text-red-500 text-xs">{ele.msg}</p>))
                }

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
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.password}</p>)}
                {serverError && serverError.length > 0 && 
                    serverError
                        .filter(ele => ele.path === 'password')
                        .map((ele, i)=>( <p key={i} className="text-red-500 text-xs">{ele.msg}</p>))
                }

                <button
                    type="submit"
                    className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Register
                </button>
            </form>

          {openExpertForm && <ExpertCreation />}
        </div>
    )
}