import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../config/axios"

export const customerLogin = createAsyncThunk('user/customerLogin', async(formData)=>{
    try{
        const response = await axios.post('/api/users/login', formData)
        console.log(response.data) 
    }catch(err){
        console.log(err)
    }
} )

export const verifyOtpApi = createAsyncThunk('user/verifyOtpApi', async(verifyOtpData, {dispatch})=>{
    try{
        const response = await axios.post('/api/users/verifyOtp', verifyOtpData)
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        dispatch(getUserProfile())
        
    }catch(err){    
        console.log(err)
    }
})

export const getUserProfile = createAsyncThunk('user/getUserProfile', async()=>{
    try{
        console.log(localStorage.getItem('token'))
        const userProfile = await axios.get('/api/users/profile', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(userProfile.data)
    }catch(err){
        console.log(err)
    }
})

const userSlice = createSlice({
    name : 'user',
    initialState : { isLoggedIn : false, user : null},
    extraReducers : {

    }
})
export default userSlice.reducer