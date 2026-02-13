import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../utils/wrapper";

//normal basequery
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080/api/",
  prepareHeaders: (headers, { getState }) => {
    const token =
      getState().auth.token || localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});




export const citizenApi = createApi({
  reducerPath: "citizenApi",
  baseQuery:baseQueryWithReauth, 
  endpoints: (builder) => ({

    citizenInfo: builder.query({
      query: () => ({
        url: '/citizen/profile',
        method: "GET"
      })
    }),

    //change password
    updatePassword:builder.mutation({
      query:(password)=>({
        url:'/citizen/profile/update-password',
        method:"PUT",
        body:{password}
      })
    }),

    //change address
    updateAddress:builder.mutation({
      query:(address)=>({
        url:'/citizen/profile/update-address',
        method:"PUT",
        body:{address}
      })
    }),

    applyCertificate:builder.mutation({
       query:(formDataToSend)=>({
        url:'/citizen/apply/new-certificate',
        method:"POST",
        body:formDataToSend
      })
    }),

    getAllApplication:builder.query({
       query:()=>({
        url:'/citizen/get-allApplication',
        method:"GET",
        
      })
    }),

    

  }),
});

export const {
  useCitizenInfoQuery,
  useUpdatePasswordMutation,
  useUpdateAddressMutation,
  useApplyCertificateMutation,
  useGetAllApplicationQuery,
  

} = citizenApi;


