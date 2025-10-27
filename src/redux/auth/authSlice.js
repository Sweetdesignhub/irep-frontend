

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
        registerStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },
        registerFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    registerStart,
    registerSuccess,
    registerFailure,
} = authSlice.actions;

export default authSlice.reducer;
