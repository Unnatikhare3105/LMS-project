//client/src/services/auth.service.ts


import { apiClient } from '@/src/lib/axios';

export const authService = {
  register: (data: { username: string; email: string; mobile: string; password: string }) =>
    apiClient.post('/user/register', data),

  loginByPassword: (data: { email: string; password: string }) =>
    apiClient.post('/user/login', data),

  sendOTP: (email: string) =>
    apiClient.post('/user/login/send-otp', { email }),

  verifyOTP: (data: { email: string; otp: string }) =>
    apiClient.post('/user/login/verify-otp', data),

  forgotPassword: (email: string) =>
    apiClient.post('/user/forgot-password', { email }),

  verifyForgotOTP: (data: { email: string; otp: string }) =>
    apiClient.post('/user/forgot-password/verify-otp', data),

  resetPassword: (data: { email: string; newPassword: string }) =>
    apiClient.post('/user/reset-password', data),

  logout: () =>
    apiClient.post('/user/logout'),

  getProfile: () =>
    apiClient.get('/user/profile'),
};