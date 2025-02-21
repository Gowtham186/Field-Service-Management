import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../config/axios"

export const sendForgotPasswordEmail = createAsyncThunk(
  'password/sendForgotPasswordEmail',
  async (email) => {
    const response = await axios.post('/api/users/forgotPassword', { email });
    return response.data;
  }
);

export const verifyOtpAndResetPassword = createAsyncThunk(
  'password/verifyOtpAndResetPassword',
  async ({ email, otp, newPassword }) => {
    const response = await axios.post('/api/verifyOtpAndResetPassword', { email, otp, newPassword })
    return response.data;
  }
);

export const resetPasswordWithOldPassword = createAsyncThunk(
  "password/resetPasswordWithOldPassword",
  async ({ email, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/resetPassword", {
        email,
        oldPassword,
        newPassword,
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data?.error || "Password reset failed");
    }
  }
);

const passwordSlice = createSlice({
  name: 'password',
  initialState: { isLoading: null,success:false,error:null },
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotPasswordEmail.pending, (state) => { state.isLoading = true })
      .addCase(sendForgotPasswordEmail.fulfilled, (state) => { state.isLoading = false })

      .addCase(verifyOtpAndResetPassword.pending, (state) => { state.isLoading = true })
      .addCase(verifyOtpAndResetPassword.fulfilled, (state) => { state.isLoading = true })

      .addCase(resetPasswordWithOldPassword.pending, (state) => {
        state.isLoading = true;
        state.success = false
        state.error = null;
      })
      .addCase(resetPasswordWithOldPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(resetPasswordWithOldPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = passwordSlice.actions;
export default passwordSlice.reducer;