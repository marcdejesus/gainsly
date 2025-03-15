import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; refresh_token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refresh_token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string; refresh_token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refresh_token;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateToken: (state, action: PayloadAction<{ token: string; refresh_token: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refresh_token;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart,
  registerSuccess,
  registerFailure,
  logout, 
  updateUser,
  updateToken 
} = authSlice.actions;

export default authSlice.reducer; 