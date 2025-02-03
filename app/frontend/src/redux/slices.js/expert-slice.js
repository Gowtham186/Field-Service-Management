import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const createExpertProfile = createAsyncThunk('expert/createExpertProfile', async({formData, resetForm},{rejectWithValue})=>{
    try{
        const response = await axios.post('/api/experts', formData, { headers : {   Authorization : localStorage.getItem('token') }})
        console.log(response.data)
        resetForm()
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})  

export const fetchSkills = createAsyncThunk('/expert/fetchSkills', async()=>{
    try{
        const response = await axios.get('/api/skills')
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getAllExperts = createAsyncThunk('expert/getAllExperts', async()=>{
    try{
        const allExperts = await axios.get('/api/experts', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(allExperts)
        return allExperts.data
    }catch(err){
        console.log(err)
    }
})

export const toggledIsVerified = createAsyncThunk('expert/editExpert', async({id, body}, {rejectWithValue})=>{
    try{
        const response = await axios.put(`/api/experts/verify/${id}`, body, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data 
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data?.errors)
    }
})

export const getExpertProfile = createAsyncThunk('expert/getExpertProfile', async({id}, {rejectWithValue}) => {
    try{
        const response = await axios.get(`/api/experts/${id}`)
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})


const expertSlice = createSlice({
    name : 'expert',
    initialState : { 
        profile : null, 
        allSkills : [],
        experts :[], 
        serverError : null,
    },
    reducers : {
        setSelectedExpertProfile : (state,action)=>{
            state.profile = action.payload
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(fetchSkills.fulfilled, (state,action)=> {
            state.allSkills = action.payload
        })
        builder.addCase(createExpertProfile.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(createExpertProfile.fulfilled, (state, action)=>{
            state.profile = action.payload
            state.serverError = null
        })
        builder.addCase(getAllExperts.fulfilled, (state,action)=>{
            state.experts = action.payload
            state.serverError = null
        })
        builder.addCase(getAllExperts.rejected, (state,action)=>{
            state.serverError = null
        })
        builder.addCase(toggledIsVerified.fulfilled, (state,action)=>{
            const index = state.experts.findIndex(ele => ele._id === action.payload._id)
            state.experts[index] = action.payload
            state.serverError = null
        })
        builder.addCase(toggledIsVerified.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(getExpertProfile.fulfilled, (state,action)=>{
            state.profile = action.payload
            state.serverError = null
        })
        builder.addCase(getExpertProfile.rejected, (state,action)=>{
            state.serverError = null
        })
    }
})
export const { setSelectedExpertProfile } = expertSlice.actions
export default expertSlice.reducer