import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getTotalRevenue = createAsyncThunk('stats/getTotalRevenue', async()=>{
    try{
        const response = await axios.get('/api/stats/total-revenue', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getExpertRevenue = createAsyncThunk('stats/getExpertRevenue', async(id)=>{
    try{
        const response = await axios.get(`/api/stats/experts/${id}/revenue`, { headers : { Authorization : localStorage.getItem('token')}} )
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getExpertBookingAnalytics = createAsyncThunk(
    'stats/getExpertBookingsAnalytics',
    async ({ id, period }) => {  // Accept both `id` and `period`
      try {
        const response = await axios.get(`/api/stats/experts/${id}/bookings`, {
          params: { period },  // Pass the period as a query parameter
          headers: { Authorization: localStorage.getItem('token') },
        });
        console.log(response.data);  // Log the response data for debugging
        return response.data;  // Return the response data to be used in the Redux store
      } catch (err) {
        console.error(err);  // Log any errors
      }
    }
  );


const statsSlice = createSlice({
    name : 'stats',
    initialState : {
        totalRevenue : 0,
        loading : false,
        expertRevenue : {
            totalRevenue : 0,
            payments : null,
            categoriesRevenue : null,
            totalBookings : 0
        },
        expertBookingAnalytics : {
            totalBookings : 0,
            currentBookings : 0,
            previousBookings :0,
            growth : null,
            bookings : []
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(getTotalRevenue.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(getTotalRevenue.fulfilled, (state, action)=>{
            state.loading = false
            state.totalRevenue = action.payload.totalRevenue
        })
        builder.addCase(getExpertRevenue.pending, (state,action)=>{
            state.loading = true
        }) 
        builder.addCase(getExpertRevenue.fulfilled, (state, action) => {
            state.loading = false;
            state.expertRevenue = {
                ...state.expertRevenue,
                totalRevenue: action.payload?.totalRevenue,
                payments: action.payload?.payments,
                categoriesRevenue : action.payload?.categoriesRevenue,
                totalBookings : action.payload?.totalBookings
            };
        });
        builder.addCase(getExpertBookingAnalytics.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(getExpertBookingAnalytics.fulfilled, (state, action) => {
            state.loading = false;  // Set loading to false when the data is fetched
            state.expertBookingAnalytics = {
              ...state.expertBookingAnalytics,
              totalBookings: action.payload?.totalBookings,  // Total bookings in the current period
              currentBookings: action.payload?.currentBookings,  // Total bookings in the current period
              previousBookings: action.payload?.previousBookings,  // Previous bookings
              growth: action.payload?.growth,  // Growth percentage
              bookings: action.payload?.bookings,  // Bookings data for the current period
              bookingsByCategory : action?.payload?.bookingsByCategory
            };
          });
          
    }
})
export default statsSlice.reducer