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

export const getCategoriesWithServices = createAsyncThunk('category/getCategoriesWithServices', async(_, {rejectWithValue})=>{
    try{
        const response = await axios.get('/api/categories/withServices', { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const updateCategoryWithServices = createAsyncThunk('category/updatedCategoryWithServices', async({id, updatedItem}, {rejectWithValue})=>{
    try{
        const response = await axios.put(`/api/categories/${id}`, updatedItem, { headers : { Authorization : localStorage.getItem('token')}} )
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const deleteService = createAsyncThunk('category/deleteService', async(serviceId, {rejectWithValue})=>{
    try{
        const response = await axios.delete(`/api/services/${serviceId}`, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const deleteManyServices = createAsyncThunk('category/deleteManyServices', async({serviceIds}, {rejectWithValue})=> {
    try{
        const response = await axios.delete('/api/services', {
            data : { serviceIds },
            headers : { Authorization : localStorage.getItem('token')}
        })
        console.log(response.data)
        return { deletedCount : response.data.deletedCount, serviceIds : response.data.serviceIds}
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const deleteCategoryAndServices = createAsyncThunk('category/deleteCategoryAndServices', async(id, {rejectWithValue}) => {
    try{
        const response = await axios.delete(`/api/categories/${id}`, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

export const newCategoryWithServices = createAsyncThunk('category/newCategoryWithServices', async(newItem, {rejectWithValue})=>{
    try{
        const response = await axios.post('/api/categories', newItem, { headers : { Authorization : localStorage.getItem('token')}})
        console.log(response.data)
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response.data.errors)
    }
})

const categorySlice = createSlice({
    name : 'category',
    initialState : {
        data : [],
        serverError : null,
        categoriesWithServices : []
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCategories.fulfilled, (state,action) => {
            state.data = action.payload
        })
        builder.addCase(getCategoriesWithServices.fulfilled, (state,action) => {
            state.categoriesWithServices = action.payload
            state.serverError = action.payload
        })
        builder.addCase(getCategoriesWithServices.rejected, (state,action)=>{
            state.categoriesWithServices = null
        })
        builder.addCase(updateCategoryWithServices.fulfilled, (state, action) => {
            const updatedCategories = state.categoriesWithServices.map((category) => {
              if (category._id === action.payload._id) {
                return {
                  ...category,
                  ...action.payload.category,
                  services: action.payload.services,
                };
              }
              return category;
            });
          
            state.categoriesWithServices = updatedCategories;
            state.serverError = null
          });      
          builder.addCase(updateCategoryWithServices.rejected, (state,action)=>{
            state.serverError = action.payload
          })    
        builder.addCase(deleteService.fulfilled, (state,action)=>{
           state.categoriesWithServices = state.categoriesWithServices.map(category => ({
            ...category,
            services : category.services.filter(service => service._id !== action.payload._id)
           }))
           state.serverError = null
        })
        builder.addCase(deleteService.rejected, (state,action) => {
            state.serverError = action.payload
        })
        builder.addCase(deleteManyServices.fulfilled, (state, action) => {
            const { serviceIds } = action.payload;
            state.categoriesWithServices = state.categoriesWithServices.map(category => {
                if (category.services) {
                    category.services = category.services
                        .filter(service => service && !serviceIds.includes(service._id));
                }
                return category;
            });
            state.serverError = null
        });
        builder.addCase(deleteCategoryAndServices.fulfilled, (state,action)=> {
            state.categoriesWithServices = state.categoriesWithServices.filter(ele => ele._id !== action.payload._id)
            state.serverError = null
        })
        builder.addCase(deleteCategoryAndServices.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(newCategoryWithServices.fulfilled, (state,action)=>{
            state.categoriesWithServices =  [...state.categoriesWithServices, action.payload]
            state.serverError = null
        })
        builder.addCase(newCategoryWithServices.rejected, (state,action)=> {
            state.serverError = action.payload
        })
        
        
    }
})

export default categorySlice.reducer