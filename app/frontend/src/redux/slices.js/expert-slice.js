import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const createExpertProfile = createAsyncThunk('expert/createExpertProfile', async({formData, resetForm})=>{
    try{
        const response = await axios.post('/api/experts', formData, { headers : {   Authorization : localStorage.getItem('token') }})
        resetForm()
        console.log(response.data)
    }catch(err){
        console.log(err)
    }
})  

export const getAllExperts = createAsyncThunk('expert/getAllExperts', async()=>{
    try{
        const allExperts = await axios.get('/api/experts', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(allExperts)
    }catch(err){
        console.log(err)
    }
})



const expertSlice = createSlice({
    name : 'expert',
    initialState : { profile : null, serverError : null},
    extraReducers : (builder)=>{
        builder.addCase(createExpertProfile.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(createExpertProfile.fulfilled, (state, action)=>{
            state.profile = action.payload
        })
    }
})
export default expertSlice.reducer