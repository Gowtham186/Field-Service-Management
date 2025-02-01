import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const querying = createAsyncThunk('search/querying', async(queryString)=>{
    try{
        const response = await axios.get(`/api/search?${queryString}`)
        console.log(response.data)
    }catch(err){
        console.log(err)
    }
})


const searchSlice = createSlice({
    name : 'search',
    initialState : { 
        coords : { lat : null, lng : null},
        resultsCategories : [],
        resultsExperts : [],
        serverError : null
    },

})
export default searchSlice.reducer    