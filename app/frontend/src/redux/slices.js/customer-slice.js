import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const bookserviceRequest = createAsyncThunk('customer/bookServiceRequest', async({newFormData}, {rejectWithValue}) => {
    try{
        const response = await axios.post('/api/service-requests', newFormData, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        // resetForm()
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getMyBookings = createAsyncThunk('customer/getMyBookings', async()=>{
    try{
        const response = await axios.get('/api/customer/my-bookings', { headers : {  Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

const customerSlice = createSlice({
    name : 'customer',
    initialState : { 
        currentBooking : null,
        loading : false,
        serverError : null,
        myBookings : null
    },
    extraReducers : (builder) =>{
        builder.addCase(bookserviceRequest.pending, (state, action)=>{
            state.loading = action.payload
        })
        builder.addCase(bookserviceRequest.fulfilled, (state, action)=>{
            state.currentBooking = action.payload
        })
        builder.addCase(bookserviceRequest.rejected, (state,action) => {
            state.serverError = action.payload
        })
        builder.addCase(getMyBookings.fulfilled, (state,action)=>{
            state.myBookings = action.payload
        })
        
    }
})
export default customerSlice.reducer
