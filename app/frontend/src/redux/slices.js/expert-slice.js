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

export const updateAvailability = createAsyncThunk('expert/updateAvailability', async ({ availability }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/api/experts/availability', { availability }, { headers: { Authorization: token } });
        return response.data;
    } catch (err) {
        console.log("Update Availability Error:", err.response?.data || err.message);
        return rejectWithValue(err.response?.data || "Failed to update availability");
    }
});

export const expertCategoriesBySkills = createAsyncThunk('expert/expertCategoriesBySkills', async(id) => {
    try{
        const response = await axios.get(`/api/experts/${id}/categories`)
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getMyServices = createAsyncThunk('expert/getMyServices', async () => {
    try {
        const response = await axios.get('/api/experts/myservices', {
            headers: { Authorization: localStorage.getItem('token') },
        });
        console.log(response.data);
        return response.data; 
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch services');
    }
});

export const updateBookingStatus = createAsyncThunk('expert/updateBookingStatus', async({id, body}) => {
    try{
        const response = await axios.put(`/api/service-requests/${id}/status`, body, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getServiceRequest = createAsyncThunk('expert/getServiceRequest', async(id) => {
    try{
        const response = await axios.get(`/api/service-requests/${id}`, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})



const expertSlice = createSlice({
    name : 'expert',
    initialState : { 
        profile : null, 
        allSkills : [],
        experts :[], 
        serverError : null,
        categoriesBySkills : [],
        loading : false,
        myServices : [],
        allExperts : [],
        serviceRequestId : null,
        workingService : null
    },
    reducers : {
        setServiceRequestId : (state,action)=>{
            state.serviceRequestId = action.payload
        },
        setWorkingService : (state,action) => {
            state.workingService = action.payload
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
        builder.addCase(updateAvailability.fulfilled, (state,action)=>{
            state.profile.availability = action.payload
        })
        builder.addCase(expertCategoriesBySkills.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(expertCategoriesBySkills.fulfilled, (state,action)=>{
            state.categoriesBySkills = action.payload
        })
        builder.addCase(getMyServices.fulfilled, (state,action)=>{
            state.myServices = action.payload
        })
        builder.addCase(updateBookingStatus.fulfilled, (state,action)=>{
            const index = state.myServices.findIndex(ele => ele._id === action.payload._id)
            state.myServices[index] = action.payload 
        })
        builder.addCase(getServiceRequest.pending, (state,action) => {
            state.loading = true
        })
    }
})
export const { setServiceRequestId, setWorkingService } = expertSlice.actions
export default expertSlice.reducer