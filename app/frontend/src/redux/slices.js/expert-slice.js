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

export const getAllExperts = createAsyncThunk('expert/getAllExperts', 
    async({search = "", skill = "", verified = "", page = 1, limit} = {})=>{
    try{
        const params = { search, skill, verified, page, limit}

        const allExperts = await axios.get('/api/experts', { 
            params ,
            headers : { Authorization : localStorage.getItem('token')}
        })
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

export const getExpertProfile = createAsyncThunk('expert/getExpertProfile', async(id, {rejectWithValue}) => {
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
        console.log(availability)
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
        console.log(id)
        const response = await axios.get(`/api/service-requests/${id}`, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const onSiteService = createAsyncThunk(
    "expert/onSiteService",
    async ({ serviceRequestId, newService }, { rejectWithValue }) => {
      try {
        const response = await axios.put("/api/service-requests/add-service",
          { serviceRequestId, newService }, 
          { headers: { Authorization: localStorage.getItem("token") } } 
        );
  
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data || "Something went wrong");
      }
    }
  );

export const deleteOnSiteService = createAsyncThunk('expert/deleteOnSiteService', async(serviceId) => {
try{
    const response = await axios.delete(`/api/service-requests/delete-service/${serviceId}`,{ headers : { Authorization : localStorage.getItem('token')}})
    console.log(response.data)
    return response.data
}catch(err){
    console.log(err)
}
})

export const updateProfile = createAsyncThunk('expert/updateProfile', async({id, body})=>{
try{
    const response = await axios.put(`/api/experts/${id}`, body, { headers : { Authorization : localStorage.getItem('token')}})
    console.log(response.data)
    // return response.data
}catch(err){
    console.log(err.response.data.errors)
}
})
  
export const addNewSkill = createAsyncThunk('expert/addNewSkill', async({ skill }) => {
try{
    const response = await axios.post('/api/skills', { skill }, { headers : { Authorization : localStorage.getItem('token')}})
    return response.data
}catch(err){
    console.log(err)
}
})

export const changeProfilePic = createAsyncThunk('expert/changeProfilePic', async({id, profilePicData})=>{
    try{
        const response = await axios.put(`/api/experts/${id}/profilePic`, profilePicData, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getUnverifiedExperts = createAsyncThunk('expert/getUnverifiedExperts', async()=>{
    try{
        const response = await axios.get('/api/experts/unverified', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getExpertReviews = createAsyncThunk('expert/getExpertReviews', async (id) => {
    try {
        const response = await axios.get(`/api/reviews/${id}`);  // Ensure correct API call
        return response.data; 
    } catch (err) {
        console.error(err);
        throw err;  // Throw error for better error handling
    }
});

export const getExpertRevenue = createAsyncThunk('expert/getExpertRevenue', async(id)=>{
    try{
        const response = await axios.get(`/api/experts/${id}/revenue`, { headers : { Authorization : localStorage.getItem('token')}} )
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
        serviceRequestId : null,
        workingService : null,
        unVerifiedExperts : null,
        revenue : {
            totalRevenue : null,
            transactions : null,
            payments : null
        }
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
        builder.addCase(fetchSkills.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(getUnverifiedExperts.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(getUnverifiedExperts.fulfilled, (state,action)=> {
            state.loading = false
            state.unVerifiedExperts = action.payload
        })
        builder.addCase(fetchSkills.fulfilled, (state,action)=> {
            state.loading = false
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
        builder.addCase(toggledIsVerified.fulfilled, (state, action) => {
            state.unVerifiedExperts = state.unVerifiedExperts.filter(
                (expert) => expert.userId._id !== action.payload.userId._id
            );
            state.serverError = null;
        });        
        builder.addCase(toggledIsVerified.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(getExpertProfile.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(getExpertProfile.fulfilled, (state,action)=>{
            state.loading = false
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
        builder.addCase(getServiceRequest.fulfilled, (state,action) => {
            state.loading = false
            state.workingService = action.payload
        })
        builder.addCase(onSiteService.fulfilled, (state, action) => {
            if (state.workingService) {
                state.workingService.onSiteServices = [...state.workingService.onSiteServices, action.payload];
            }
        });        
        builder.addCase(deleteOnSiteService.fulfilled, (state, action)=>{
            if(state.workingService){
                state.workingService.onSiteServices = state.workingService.onSiteServices.filter(
                    (service) => service._id !== action.payload
                )
            }
        })
        builder.addCase(addNewSkill.fulfilled, (state,action)=>{
            state.allSkills.push(action.payload)
        })
        builder.addCase(changeProfilePic.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(changeProfilePic.fulfilled, (state,action)=>{
            state.loading = false
            state.profile = {...state.profile, profilePic : action.payload}
        })
        builder.addCase(getExpertRevenue.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(getExpertRevenue.fulfilled, (state, action) => {
            state.loading = false;
            state.revenue = {
                ...state.revenue,
                totalRevenue: action.payload.totalRevenue,
                payments: action.payload.payments,
            };
        });        
    }
})
export const { setServiceRequestId, setWorkingService } = expertSlice.actions
export default expertSlice.reducer