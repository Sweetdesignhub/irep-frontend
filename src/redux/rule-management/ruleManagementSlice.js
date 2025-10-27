import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const ruleManagementSlice = createSlice({
  name: 'ruleManagement',
  initialState,
  reducers: {
    setRuleManagement: (state, action) => {
      return action.payload;
    },
    clearRuleManagement: () => {
      return []; 
    },
  },
});

export const { setRuleManagement, clearRuleManagement } = ruleManagementSlice.actions;
export default ruleManagementSlice.reducer;
