import { getCurrentUser , logoutUser } from '../../appwrite/auth';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface User {
  accountId: string;
  name: string;
  email: string;
  imageUrl?: string; // optional, for profile picture
  joinedAt?: string; // optional, if you store it
}

export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unknown error';
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
      });
  }
  
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
