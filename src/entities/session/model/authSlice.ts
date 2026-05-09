import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Types ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_name: string;
  role: 'admin' | 'sudo' | 'user';
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────
const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

// ─── Initial State ───────────────────────────────────────────────────
const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: loadUser(),
};

// ─── Slice ───────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Store the JWT token and user profile after a successful login.
     * Both values are persisted to localStorage for session hydration.
     */
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    /**
     * Clear all auth state and remove persisted data.
     * Called explicitly by the user or automatically on a 401 response.
     */
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

// ─── Exports ─────────────────────────────────────────────────────────
export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;

export const selectToken = (state: { auth: AuthState }) =>
  state.auth.token;

export default authSlice.reducer;
