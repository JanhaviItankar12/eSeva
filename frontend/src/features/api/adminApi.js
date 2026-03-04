import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const adminApi = createApi({
  reducerPath: "adminApi",
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
   tagTypes: ['Officer','Office', 'District', 'Tehsil', 'Gram'],
  endpoints: (builder) => ({
    createOfficer:builder.mutation({
      query: (userData) => ({
        url: '/admin/create-officer',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Officer'],
    }),

    
    getAllOfficers:builder.query({
      query:()=>({
        url:'/admin/get-all-officer',
        method:'GET'
      }),
      invalidatesTags: ['Officer'],
    }),

     // Office Management
    createOffice: builder.mutation({
      query: (officeData) => ({
        url: '/admin/offices',
        method: 'POST',
        body: officeData,
      }),
        invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: 'Office', id: 'LIST' },
          { type: arg.officeLevel, id: 'LIST' }
        ];
        
        // If it's a child office, also invalidate the parent's list
        if (arg.parentOffice) {
          if (arg.officeLevel === 'TEHSIL') {
            tags.push({ type: 'Tehsil', id: arg.parentOffice });
          } else if (arg.officeLevel === 'GRAM') {
            tags.push({ type: 'Gram', id: arg.parentOffice });
          }
        }
        
        return tags;
      },
    }),

    updateOffice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/offices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id, officeLevel, parentOffice }) => {
        const tags = [
          { type: 'Office', id },
          { type: 'Office', id: 'LIST' },
          { type: officeLevel, id },
          { type: officeLevel, id: 'LIST' }
        ];
        
        if (parentOffice) {
          if (officeLevel === 'TEHSIL') {
            tags.push({ type: 'Tehsil', id: parentOffice });
          } else if (officeLevel === 'GRAM') {
            tags.push({ type: 'Gram', id: parentOffice });
          }
        }
        
        return tags;
      },
    }),

 deActivateOffice: builder.mutation({
  query: (id) => ({
    url: `/admin/offices/${id}/deActivate`,
    method: 'PATCH',
  }),
  invalidatesTags: (result, error, id) => [
        { type: 'Office', id: 'LIST' },
        { type: 'District', id: 'LIST' },
        { type: 'Tehsil', id: 'LIST' },
        { type: 'Gram', id: 'LIST' },
        { type: 'Office', id }
      ]
}),

activateOffice: builder.mutation({
  query: (id) => ({
    url: `/admin/offices/${id}/activate`,
    method: 'PATCH',
  }),
  invalidatesTags: (result, error, id) => [
        { type: 'Office', id: 'LIST' },
        { type: 'District', id: 'LIST' },
        { type: 'Tehsil', id: 'LIST' },
        { type: 'Gram', id: 'LIST' },
        { type: 'Office', id }
      ]
}),

  })
});

export const {
   useCreateOfficerMutation,
   useGetAllOfficersQuery,
   useCreateOfficeMutation,
   useUpdateOfficeMutation,
   useDeActivateOfficeMutation,
   useActivateOfficeMutation
}=adminApi;