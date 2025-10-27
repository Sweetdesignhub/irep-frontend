// src/redux/nodesEdges/storeNodesEdges.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    decisionNodes: [],
    decisionEdges: [],
};

const decisionNodesEdgesSlice = createSlice({
    name: "decisionNodesEdges",
    initialState,
    reducers: {
        setDecisionNodes(state, action) {
            state.decisionNodes = action.payload;
        },
        setDecisionEdges(state, action) {
            state.decisionEdges = action.payload;
        },
    },
});

export const { setDecisionNodes, setDecisionEdges } = decisionNodesEdgesSlice.actions;
export default decisionNodesEdgesSlice.reducer;
