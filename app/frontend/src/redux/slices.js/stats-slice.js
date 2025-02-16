import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const getTotalRevenue = await createAsyncThunk('stats/getTotalRevenue', async()=>{
    try{
        const response = await axios.get('/api/stats/total-revenue', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

const statsSlice = createSlice({
    name : 'stats',
    initialState : {
        totalRevenue : 0,
        loading : false
    },
    extraReducers : (builder)=>{
        builder.addCase(getTotalRevenue.pending, (state, action)=>{
            state.loading = true
        })
        builder.addCase(getTotalRevenue.fulfilled, (state, action)=>{
            state.loading = false
            state.totalRevenue = action.payload.totalRevenue
        })
    }
})
export default statsSlice.reducer