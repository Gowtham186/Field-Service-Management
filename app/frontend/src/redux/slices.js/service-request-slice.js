import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getAllServiceRequests = createAsyncThunk('serviceRequest', 
    async({search = "", status = "", category = "", sort = "", page =1, limit} = {})=>{
    try{
        const params = { search, status, category, sort, page, limit}
        
        const response = await axios.get(`/api/service-requests`, { 
            params,
            headers : { Authorization : localStorage.getItem('token')}
        })
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})


const serviceRequestSlice = createSlice({
    name : 'serviceRequest',
    initialState : {
        allServiceRequests : [],
        loading : false
    },
    extraReducers: (builder) => {
        builder.addCase(getAllServiceRequests.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(getAllServiceRequests.fulfilled, (state,action) => {
            state.loading = false
            state.allServiceRequests = action.payload
        })
    }
    
})
export default serviceRequestSlice.reducer