import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const fetchCategories = createAsyncThunk('category/fetchCategories', async()=>{
    try{
        const response = await axios.get('/api/categories')
        return response.data
    }catch(err){
        console.log(err)
    }
})

const categorySlice = createSlice({
    name : 'category',
    initialState : {
        data : [],
        error : null
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCategories.fulfilled, (state,action) => {
            state.data = action.payload
        })
    }
})

export default categorySlice.reducer