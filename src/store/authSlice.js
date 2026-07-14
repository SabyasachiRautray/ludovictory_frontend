import { createSlice } from '@reduxjs/toolkit';

const STORAGE_TOKEN_KEY = 'dycek_token';
const STORAGE_USER_KEY = 'dycek_user';

const getStoredAuth = () => {
  try {
    const token = sessionStorage.getItem(STORAGE_TOKEN_KEY);
    const user = JSON.parse(sessionStorage.getItem(STORAGE_USER_KEY) || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const initial = getStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initial.token,
    user: initial.user,
    isAuthenticated: !!initial.token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      sessionStorage.setItem(STORAGE_TOKEN_KEY, token);
      sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(state.user));
    },
updateWalletBalance: (state, action) => {
  if (state.user) {
    // action.payload = { referral_token_balance, shopping_token_balance }
    state.user.referral_token_balance = action.payload.referral_token_balance ?? state.user.referral_token_balance;
    state.user.shopping_token_balance = action.payload.shopping_token_balance ?? state.user.shopping_token_balance;
    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(state.user));
  }
},
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem(STORAGE_TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_USER_KEY);
    },
  },
});

export const { setCredentials, updateUser, updateWalletBalance, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
