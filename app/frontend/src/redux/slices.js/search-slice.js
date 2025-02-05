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


const searchSlice = createSlice({
    name : 'search',
    initialState : { 
        currentAddress : null,
        resultsCategories : [],
        resultsExperts : null,
        serverError : null,
        selectedSkill : null,
        choosenServices : [],
        selectedExpert : null
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
        builder.addCase(querying.fulfilled, (state,action)=>{
            state.resultsExperts = action.payload?.filteredExperts
            //state.resultsCategories = action.payload.skills
            state.serverError = null
        })
        builder.addCase(querying.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(getAddress.fulfilled, (state,action)=>{
            state.currentAddress = action.payload
        })
    }
})
export const { setSearchSkillState, selectService, setSelectedExpert } = searchSlice.actions
export default searchSlice.reducer    