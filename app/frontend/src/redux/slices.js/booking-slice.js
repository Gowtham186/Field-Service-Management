import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const bookserviceRequest = createAsyncThunk('booking/bookServiceRequest', async({newFormData, resetForm}, {rejectWithValue}) => {
    try{
        const response = await axios.post('/api/service-requests', newFormData, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        resetForm()
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

const bookingSlice = createSlice({
    name : 'booking',
    initialState : { 
        currentBooking : null,
        loading : false,
        serverError : null
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
        
    }
})
export default bookingSlice.reducer
