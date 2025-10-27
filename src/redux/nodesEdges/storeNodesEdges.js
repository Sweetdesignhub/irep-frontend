// src/redux/nodesEdges/storeNodesEdges.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nodes: [],
    edges: [],
};

const nodesEdgesSlice = createSlice({
    name: "nodesEdges",
    initialState,
    reducers: {
        setNodes(state, action) {
            state.nodes = action.payload;
        },
        setEdges(state, action) {
            state.edges = action.payload;
        },
    },
});

export const { setNodes, setEdges } = nodesEdgesSlice.actions;
export default nodesEdgesSlice.reducer;
