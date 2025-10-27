// src/redux/slices/organizationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organizations: [], // Store fetched organizations here
    loading: false,
};

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        setOrganizations: (state, action) => {
            state.organizations = action.payload;
            state.loading = false;
        },
        addOrganization: (state, action) => {
            state.organizations.push(action.payload);
        },
        updateOrganization: (state, action) => {
            state.organizations = state.organizations.map((org) =>
                org.id === action.payload.id ? action.payload : org
            );
        },
        deleteOrganization: (state, action) => {
            state.organizations = state.organizations.filter(
                (org) => org.id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setOrganizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    setLoading,
} = organizationSlice.actions;

export default organizationSlice.reducer;
