import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserSession {
  token: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
    role: string;
  };
}

export interface SessionState {
  userSession: UserSession | null;
}

const initialState: SessionState = {
  userSession: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession( state,  action: PayloadAction<UserSession>) {
      state.userSession = action.payload;
    },

    clearSession(state) {
      state.userSession = null;
    },
  },
});

export const sessionActions = sessionSlice.actions;
export default sessionSlice.reducer;
