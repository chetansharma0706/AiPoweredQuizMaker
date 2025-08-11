import { type PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  accountId: string;
  name: string;
  email: string;
  imageUrl?: string;
  joinedAt?: string;
}

export interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

// ---------- Async Thunks ----------

// Google Login
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/.netlify/functions/loginWithGoogle");
      if (!res.ok) throw new Error("Google login failed");

      // This function will probably redirect to Google,
      // so you may not get a normal JSON here unless backend is set up that way
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/.netlify/functions/getCurrentUser");
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/.netlify/functions/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------- Slice ----------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
        state.user = null;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.status = "idle";
      state.user = null;
    });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
