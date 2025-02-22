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
        const response = await axios.post('/api/servicefee', body, { headers : { Authorization : localStorage.getItem('token')}})
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
        updateNewBooking: (state, action) => {
            if (!state.myBookings) {
              state.myBookings = []; // Ensure it is an array before pushing
            }
            state.myBookings.push(action.payload);
          },          
        customerBookingStatusUpdated: (state, action) => {
            const updatedBooking = action.payload;
            state.myBookings = state.myBookings.map(booking =>
                booking._id === updatedBooking._id ? { ...booking, ...updatedBooking } : booking
            );
        },
        addOnSiteService: (state, action) => {
            const { serviceRequestId, newService } = action.payload;
        
            if (state.workingService?._id === serviceRequestId) {
                state.workingService = {
                    ...state.workingService,
                    onSiteServices: [...state.workingService.onSiteServices, newService],
                };
            }
        
            const booking = state.myBookings.find(b => b._id === serviceRequestId);
            if (booking) {
                booking.onSiteServices = [...booking.onSiteServices, newService]; // Immutability fix
            }
        },
        removeOnSiteService: (state, action) => {
            const { serviceRequestId, removedServiceId } = action.payload;
        
            if (state.workingService?._id === serviceRequestId) {
                state.workingService = {
                    ...state.workingService,
                    onSiteServices: state.workingService.onSiteServices.filter(
                        (service) => service._id !== removedServiceId
                    ),
                };
            }
        }                          
    },
    extraReducers : (builder) =>{
        builder.addCase(bookserviceRequest.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(bookserviceRequest.fulfilled, (state, action)=>{
            state.loading = false
            state.currentBooking = action.payload
        })
        builder.addCase(bookserviceRequest.rejected, (state,action) => {
            state.serverError = action.payload
        })
        builder.addCase(getMyBookings.fulfilled, (state,action)=>{
            state.myBookings = action.payload
        })
        builder.addCase(getWorkingService.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(getWorkingService.fulfilled, (state,action)=>{
            state.loading = false
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
export const { setCurrentService, updateNewBooking, customerBookingStatusUpdated, addOnSiteService, removeOnSiteService } = customerSlice.actions
export default customerSlice.reducer
