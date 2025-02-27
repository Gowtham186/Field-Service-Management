import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../config/axios"
//import lodash from 'lodash'

export const customerLogin = createAsyncThunk('user/customerLogin', async(formData)=>{
    try{
        const response = await axios.post('/api/users/login', formData)
        console.log(response.data) 
    }catch(err){
        console.log(err)
    }
} )

export const verifyOtpApi = createAsyncThunk('user/verifyOtpApi', async({verifyOtpData, resetForm}, {dispatch, rejectWithValue})=>{
    try{
        const response = await axios.post('/api/users/verifyOtp', verifyOtpData)
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        resetForm()
    }catch(err){    
        console.log(err)
        return rejectWithValue(err.response?.data?.errors)
    }
})

export const getUserProfile = createAsyncThunk('user/getUserProfile', async(_, {rejectWithValue})=>{
    try{
        const userProfile = await axios.get('/api/users/profile', { headers : { Authorization : localStorage.getItem('token')}})
        //const userData = lodash._.pick(userProfile.data, ['_id', 'phone_number', 'role', 'email'])
        const { _id, name, phone_number, role, email } = userProfile.data;
        const userData = { _id, name, phone_number, role, email };
        //console.log(userData)
        return userData
    }catch(err){        
        console.log(err)
        return rejectWithValue(err.response?.data?.errors || 'Error fetching user profile')
    }
})

export const expertLogin = createAsyncThunk('user/expertLogin', async({formData, resetForm}, {rejectWithValue})=>{
    try{
        const response = await axios.post('/api/users/login', formData)
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        resetForm()
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data?.errors)
    }
})

export const expertRegister = createAsyncThunk('user/expertRegister', async({formData, resetForm}, {rejectWithValue})=>{
    try{
        const response = await axios.post('/api/users/register', formData)
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        resetForm()
    }catch(err){
        console.log(err)
        return rejectWithValue(err.response?.data?.errors)
    }
})

export const updateUser = createAsyncThunk("user/updateuser", async (editData, { rejectWithValue }) => {
      try {
        const response = await axios.put("/api/users", editData, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log("API Response:", response.data);
        return response.data; 
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to update user");
      }
    }
  );

const userSlice = createSlice({
    name : 'user',
    initialState : { 
        isLoggedIn : false, 
        user : null, 
        loading : false,
        serverError : null},
    reducers : {
        logout : (state,action)=>{
            state.isLoggedIn = false
            state.user = null
        },
        setServerError : (state,action)=>{
            state.serverError = null
        }
    },
    extraReducers : (builder)=> {
        builder.addCase(verifyOtpApi.rejected, (state,action)=>{
            state.serverError = action.payload
        })
        builder.addCase(getUserProfile.fulfilled, (state,action)=>{
            state.loading = false
            state.user = action.payload
            state.isLoggedIn = true
            state.serverError = null
        })
        builder.addCase(getUserProfile.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getUserProfile.rejected, (state, action)=>{
            state.serverError = action.payload
        })
        builder.addCase(expertLogin.rejected, (state, action)=>{
            state.serverError = action.payload
        })
        builder.addCase(expertRegister.rejected, (state, action)=>{
            state.serverError = action.payload
        })
        builder.addCase(updateUser.pending, (state,action)=>{
            state.loading = true
        })
        builder.addCase(updateUser.fulfilled, (state,action)=>{
            state.loading = false
            state.user = action.payload
        })
        
    }
})
export const { logout, setServerError } = userSlice.actions
export default userSlice.reducer