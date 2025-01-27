import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const createExpertProfile = createAsyncThunk('expert/createExpertProfile', async(formData)=>{
    try{
        const response = await axios.post('/api/experts', formData, 
            { headers : { 
                Authorization : localStorage.getItem('token')
                
            }})
        console.log(response.data)
    }catch(err){
        console.log(err)
    }
})  

const expertSlice = createSlice({
    name : 'expert',
    initialState : { profile : null, serverError : null},
    extraReducers : (builder)=>{

    }
})
export default expertSlice.reducer