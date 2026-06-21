import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    return data.user || null;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || "Login failed.");
    return data.user;
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error || "Signup failed.");
    return data.user;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    isAuthModalOpen: false,
    authView: "login", // "login" | "signup" | "forgot"
  },
  reducers: {
    setAuthView(state, action) {
      state.authView = action.payload;
    },
    openAuthModal(state, action) {
      state.authView = action.payload || "login";
      state.isAuthModalOpen = true;
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false;
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthModalOpen = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthModalOpen = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setAuthView, openAuthModal, closeAuthModal, updateUser } =
  authSlice.actions;
export default authSlice.reducer;