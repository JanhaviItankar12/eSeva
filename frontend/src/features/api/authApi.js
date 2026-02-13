import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    
    register: builder.mutation({
      query: ({name, email, mobile, password}) => ({
        url: "/auth/register",
        method: "POST",
        body: {name, email, mobile, password},
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { 
  useRegisterMutation,
  useLoginMutation,
  
 } = authApi;