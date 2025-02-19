import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const bookserviceRequest = createAsyncThunk('customer/bookServiceRequest', async({newFormData, resetForm}, {rejectWithValue}) => {
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

export const getMyBookings = createAsyncThunk('customer/getMyBookings', async()=>{
    try{
        const response = await axios.get('/api/customer/my-bookings', { headers : {  Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getWorkingService = createAsyncThunk('customer/getWorkingService', async(id)=>{
    try{
        const response = await axios.get(`/service-requests/${id}`, { headers : { Authorization  : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const payServicefee = createAsyncThunk('customer/payServiceFee', async(body)=>{
    try{
        const response = await axios.post('/api/servicefee', body)
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const fetchPaymentDetails = createAsyncThunk("customer/fetchPaymentDetails",
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/payment/details?session_id=${sessionId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return rejectWithValue(err.response?.data?.error || "Failed to fetch payment details");
        }
    }
)

export const saveBookingToDb = createAsyncThunk(
    "booking/saveBookingToDb",
    async ({ id, expertId, selectedServices }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`/api/customers/${id}/save-bookings`, {expertId, selectedServices },
            { headers : { Authorization : localStorage.getItem("token")}}
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error saving booking");
      }
    }
  );

const customerSlice = createSlice({
    name : 'customer',
    initialState : { 
        currentBooking : null,
        loading : false,
        serverError : null,
        myBookings : null,
        workingService : null,
        paymentDetails : null,
        savedBookings : null
    },
    reducers : {
        setCurrentService : (state,action)=>{
            state.workingService = action.payload
        },
        updateNewBooking : (state,action)=>{
            state.myBookings.push(action.payload)
        },
        customerBookingStatusUpdated: (state, action) => {
            const updatedBooking = action.payload;
            const index = state.myBookings.findIndex(booking => booking._id === updatedBooking._id)
            if (index !== -1) {
                state.myBookings[index] = updatedBooking
            }
        }        
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
        builder.addCase(getWorkingService.pending, (state,action)=>{
            state.loading = false
        })
        builder.addCase(getWorkingService.fulfilled, (state,action)=>{
            state.workingService = action.payload
        })
        builder.addCase(fetchPaymentDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchPaymentDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.paymentDetails = action.payload;
        })
        builder.addCase(fetchPaymentDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(saveBookingToDb.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(saveBookingToDb.fulfilled, (state, action) => {
            state.loading = false
            state.savedBookings = action.payload;
        })
        builder.addCase(saveBookingToDb.rejected, (state, action) => {
            state.serverError = action.payload;
        });
    }
})
export const { setCurrentService, updateNewBooking, customerBookingStatusUpdated } = customerSlice.actions
export default customerSlice.reducer
