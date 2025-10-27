import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    secretKeys: [],
    loading: false,
    error: null,
};

const secretKeysSlice = createSlice({
    name: "secretKeys",
    initialState,
    reducers: {
        setSecretKeys(state, action) {
            state.secretKeys = action.payload;
        },
        addSecretKey(state, action) {
            state.secretKeys.push(action.payload);
        },
        updateSecretKey(state, action) {
            const index = state.secretKeys.findIndex((key) => key.id === action.payload.id);
            if (index !== -1) {
                state.secretKeys[index] = action.payload;
            }
        },
        deleteSecretKey(state, action) {
            state.secretKeys = state.secretKeys.filter((key) => key.id !== action.payload);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setSecretKeys,
    addSecretKey,
    updateSecretKey,
    deleteSecretKey,
    setLoading,
    setError,
} = secretKeysSlice.actions;

export default secretKeysSlice.reducer;
