import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice.js";
import { authApi } from "../features/api/authApi.js";
import { citizenApi } from "../features/api/citizenApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(citizenApi.middleware),
});




