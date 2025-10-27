// src/redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ruleManagementReducer from "./rule-management/ruleManagementSlice.js";
import authReducer from "./auth/authSlice.js";
import nodesEdgesReducer from "./nodesEdges/storeNodesEdges.js"; // Import your new reducer
import decisionNodeEdgesReducer from "./nodesEdges/storeDecisionEngine.js"; // Import your new reducer
import secretKeysReducer from "./secretKeysSlice/secretKeysSlice.js";
import organizationSlice from "./organizationSlice/organizationSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine all reducers
const rootReducer = combineReducers({
  ruleManagement: ruleManagementReducer,
  auth: authReducer,
  nodesEdges: nodesEdgesReducer, // Add nodes and edges reducer
  decisionNodesEdges: decisionNodeEdgesReducer,
  secretKeys: secretKeysReducer, // Add secretKeys reducer
  organization: organizationSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks (for example, with non-serializable data in Redux state)
    }),
});

// Create the persistor
export const persistor = persistStore(store);
