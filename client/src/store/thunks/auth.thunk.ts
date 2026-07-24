//client/src/store/thunks/auth.thunk.ts
import { authService } from "@/src/services/auth.service";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
    'auth/login',
    //   async (creds: { email: string; password: string }, { rejectWithValue: any }) => {
    async (creds: { email: string; password: string }, { rejectWithValue }) => {
        try {
            // const res = await apiClient.post('/user/login', creds);
            const res = await authService.loginByPassword(creds);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Login failed.');
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authService.logout();
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Logout failed.');
    }
});

export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        data: { username: string; email: string; mobile: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await authService.register(data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed.');
        }
    }
);

export const sendOTPThunk = createAsyncThunk(
    'auth/sendOTP',
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await authService.sendOTP(email);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send OTP.');
        }
    }
);

export const verifyOTPThunk = createAsyncThunk(
    'auth/verifyOTP',
    async (data: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            const res = await authService.verifyOTP(data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'OTP verification failed.');
        }
    }
);

export const forgotPasswordThunk = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await authService.forgotPassword(email);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send reset OTP.');
        }
    }
);

export const verifyForgotOTPThunk = createAsyncThunk(
    'auth/verifyForgotOTP',
    async (data: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            const res = await authService.verifyForgotOTP(data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'OTP verification failed.');
        }
    }
);

export const resetPasswordThunk = createAsyncThunk(
    'auth/resetPassword',
    async (data: { email: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const res = await authService.resetPassword(data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Password reset failed.');
        }
    }
);

