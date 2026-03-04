import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice.js";
import { authApi } from "../features/api/authApi.js";
import { citizenApi } from "../features/api/citizenApi.js";
import { adminApi } from "../features/api/adminApi.js";
import { officeApi } from "../features/api/officeApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [citizenApi.reducerPath]: citizenApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
     [officeApi.reducerPath]: officeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(citizenApi.middleware)
  .concat(adminApi.middleware)
  .concat(officeApi.middleware),
});




