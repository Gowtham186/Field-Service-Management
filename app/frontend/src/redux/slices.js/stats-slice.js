import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getTotalRevenue = createAsyncThunk('stats/getTotalRevenue', async(_, {rejectWithValue})=>{
    try{
        const response = await axios.get('/api/stats/total-revenue', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue.response.data.errors
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
    async ({ id, period }) => {  
      try {
        const response = await axios.get(`/api/stats/experts/${id}/bookings`, {
          params: { period },  
          headers: { Authorization: localStorage.getItem('token') },
        });
        console.log(response.data);  
        return response.data; 
      } catch (err) {
        console.error(err); 
      }
    }
);

export const fetchStatsCounts = createAsyncThunk('stats/statsCoutns',
    async() => {
        try{
            const response = await axios.get('/api/stats/counts')
            console.log(response.data)
            return response.data
        }catch(err){
            console.log(err)
        }
    }
)

export const fetchAdminBookingsAnalytics = createAsyncThunk(
    "stats/fetchAdminBookingsAnalytics",
    async (_, { rejectWithValue }) => {
        try {
        const response = await axios.get("/api/stats/bookings-analytics");
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response.data);
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
        },
        allAnalytics : {
            
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
        builder.addCase(fetchStatsCounts.pending, (state)=>{
            state.loading = true
        })
        builder.addCase(fetchStatsCounts.fulfilled, (state,action)=>{
            state.loading = false
        })
          
    }
})
export default statsSlice.reducer