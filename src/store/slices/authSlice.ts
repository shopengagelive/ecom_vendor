import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthStatus = "unauthenticated" | "pending" | "approved" | "blocked";

export interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  status?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  status: "unauthenticated",
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setAuthStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
    resetAuth() {
      return initialState;
    },
  },
});

export const { setAuthLoading, setAuthUser, setAuthStatus, resetAuth } =
  authSlice.actions;
export default authSlice.reducer;
