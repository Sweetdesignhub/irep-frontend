import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: {},
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    updateNodeData: (state, action) => {
      const { id, data } = action.payload;
      state.nodes[id] = { ...state.nodes[id], ...data };
    },
  },
});

export const { updateNodeData } = workflowSlice.actions;
export default workflowSlice.reducer;
