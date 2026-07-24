//client/src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, IUser } from '@/src/types';
import {
  forgotPasswordThunk,
  loginUser,
  logoutUser,
  registerUser,
  resetPasswordThunk,
  sendOTPThunk,
  verifyForgotOTPThunk,
  verifyOTPThunk,
} from '../thunks/auth.thunk';

const normalizeUser = (value: any): IUser | null => {
  if (!value) return null;

  return {
    publicId: value.publicId ?? value.userId ?? '',
    name: value.name ?? value.username ?? '',
    email: value.email ?? '',
    role: value.role ?? 'student',
    accountVerified: value.accountVerified ?? false,
    streak: value.streak ?? { current: 0, longest: 0, lastActivityDate: null },
    activityLog: value.activityLog ?? [],
    totalQuizzesTaken: value.totalQuizzesTaken ?? 0,
    totalTopicsSearched: value.totalTopicsSearched ?? 0,
  } as IUser;
};

const persistAuth = (token: string | null, user: IUser | null) => {
  if (typeof window === 'undefined') return;

  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null as string | null, user: null as IUser | null };
  }

  try {
    const token = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');
    return {
      token,
      user: rawUser ? normalizeUser(JSON.parse(rawUser)) : null,
    };
  } catch {
    return { token: null as string | null, user: null as IUser | null };
  }
};

const { token: storedToken, user: storedUser } = getStoredAuth();

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  loading: false,
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      persistAuth(state.token, action.payload);
    },
    clearAuth(state: any) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      persistAuth(null, null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state: any) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state: any, action: any  ) => {
        const payloadUser = normalizeUser(action.payload?.data ?? action.payload?.user);
        const payloadToken = action.payload?.token ?? null;

        state.loading = false;
        state.user = payloadUser;
        state.token = payloadToken;
        state.isAuthenticated = Boolean(payloadToken);
        persistAuth(payloadToken, payloadUser);
      })
      .addCase(loginUser.rejected, (state: any) => { state.loading = false; })
      .addCase(logoutUser.fulfilled, (state: any) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        persistAuth(null, null);
      })

      .addCase(registerUser.pending, (state: any) => { state.loading = true; })
    .addCase(registerUser.fulfilled, (state: any, action: any) => {
      const payloadUser = normalizeUser(action.payload?.data ?? action.payload?.user);
      const payloadToken = action.payload?.token ?? null;

      state.loading = false;
      state.user = payloadUser;
      state.token = payloadToken;
      state.isAuthenticated = Boolean(payloadToken);
      persistAuth(payloadToken, payloadUser);
    })
    .addCase(registerUser.rejected, (state: any) => { state.loading = false; })

    .addCase(verifyOTPThunk.pending, (state: any) => { state.loading = true; })
    .addCase(verifyOTPThunk.fulfilled, (state: any, action: any) => {
      const payloadUser = normalizeUser(action.payload?.data ?? action.payload?.user);
      const payloadToken = action.payload?.token ?? null;

      state.loading = false;
      state.user = payloadUser;
      state.token = payloadToken;
      state.isAuthenticated = Boolean(payloadToken);
      persistAuth(payloadToken, payloadUser);
    })
    .addCase(verifyOTPThunk.rejected, (state: any) => { state.loading = false; })

    // sendOTP, forgotPassword, verifyForgotOTP, resetPassword
    // only need loading — no state change needed
    .addCase(sendOTPThunk.pending, (state: any) => { state.loading = true; })
    .addCase(sendOTPThunk.fulfilled, (state: any) => { state.loading = false; })
    .addCase(sendOTPThunk.rejected, (state: any) => { state.loading = false; })

    .addCase(forgotPasswordThunk.pending, (state: any) => { state.loading = true; })
    .addCase(forgotPasswordThunk.fulfilled, (state: any) => { state.loading = false; })
    .addCase(forgotPasswordThunk.rejected, (state: any) => { state.loading = false; })

    .addCase(verifyForgotOTPThunk.pending, (state: any) => { state.loading = true; })
    .addCase(verifyForgotOTPThunk.fulfilled, (state: any) => { state.loading = false; })
    .addCase(verifyForgotOTPThunk.rejected, (state: any) => { state.loading = false; })

    .addCase(resetPasswordThunk.pending, (state: any) => { state.loading = true; })
    .addCase(resetPasswordThunk.fulfilled, (state: any) => { state.loading = false; })
    .addCase(resetPasswordThunk.rejected, (state: any) => { state.loading = false; })
},
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;



