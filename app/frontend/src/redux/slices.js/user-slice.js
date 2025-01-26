import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../config/axios"
import _ from 'lodash'

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
        console.log(localStorage.getItem('token'))
    }catch(err){    
        console.log(err)
    }
})

export const getUserProfile = createAsyncThunk('user/getUserProfile', async()=>{
    try{
        const userProfile = await axios.get('/api/users/profile', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(userProfile.data)
        const userData = _.pick(userProfile.data, ['_id', 'phone_number', 'role', 'email'])
        console.log(userData)
        return userData
    }catch(err){        
        console.log(err)
    }
})

export const expertLogin = createAsyncThunk('user/expertLogin', async({formData, resetForm}, {rejectWithValue})=>{
    try{
        const response = await axios.post('/api/users/login', formData)
        console.log(response.data)
        resetForm()
        localStorage.setItem('token', response.data.token)
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

const userSlice = createSlice({
    name : 'user',
    initialState : { isLoggedIn : false, user : null, serverError : null},
    
    extraReducers : (builder)=> {
        builder.addCase(verifyOtpApi.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(getUserProfile.fulfilled, (state,action)=>{
            state.user = action.payload
            state.isLoggedIn = true
            state.serverError = null
        })
        builder.addCase(getUserProfile.rejected, (state, action)=>{
            state.serverError = action.payload
        })


        
    }
})
export default userSlice.reducer