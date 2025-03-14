import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/axios";

export const querying = createAsyncThunk('search/querying', async(queryString, {rejectWithValue})=>{
    try{
        const response = await axios.get(`/api/search?${queryString}`)
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const getAddress = createAsyncThunk('search/getAddress', async({lat, lng}) =>{
    try{
        const response = await axios.get(`/api/getAddress?lat=${lat}&lng=${lng}`)
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
    }
})

export const getCoords = createAsyncThunk('search/getCoords', async ({ address }) => {
    try {
        const response = await axios.get(`/api/getCoords?address=${address}`);
        return response.data;  // Ensure the lat/lng is returned
    } catch (err) {
        console.log(err);
        throw err;
    }
});



const searchSlice = createSlice({
    name : 'search',
    initialState : { 
        currentAddress : null,
        resultsCategories : [],
        resultsExperts : null,
        serverError : null,
        selectedSkill : null,
        choosenServices : [],
        selectedExpert : null,
        loading : false
    },
    reducers : {
        setSearchSkillState : (state,action)=>{
            state.selectedSkill = action.payload
        },
        selectService : (state,action)=>{
            state.choosenServices = action.payload
        },
        setSelectedExpert : (state,action)=>{
            state.selectedExpert = action.payload
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(querying.pending, (state,action)=>{
            state.loading = true
            state.serverError = null
            state.resultsExperts = null
        })
        builder.addCase(querying.fulfilled, (state,action)=>{
            state.loading = false
            state.resultsExperts = action.payload?.verifiedExperts
            //state.resultsCategories = action.payload.skills
            state.serverError = null
        })
        
        builder.addCase(querying.rejected, (state,action)=>{
            state.loading = false
            state.serverError = action.payload
            state.resultsExperts = null
        })
        builder.addCase(getAddress.fulfilled, (state,action)=>{
            state.currentAddress = action.payload
        })
    }
})
export const { setSearchSkillState, selectService, setSelectedExpert } = searchSlice.actions
export default searchSlice.reducer    