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
  tagTypes: ['Officer', "Officers", 'Office', 'District', 'Tehsil', 'Gram', 'Settings'],
  endpoints: (builder) => ({
    createOfficer: builder.mutation({
      query: (userData) => ({
        url: '/admin/create-officer',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Officer'],
    }),


    getAllOfficers: builder.query({
      query: () => ({
        url: '/admin/get-all-officer',
        method: 'GET'
      }),
      invalidatesTags: ['Officer'],
    }),

    updateOfficer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Officers"],
    }),

    // Lock officer
    lockOfficer: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/${id}/lock`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Officers"],
    }),

    // Unlock officer
    unlockOfficer: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}/unlock`,
        method: "PATCH",
      }),
      invalidatesTags: ["Officers"],
    }),

    // Deactivate officer
    deactivateOfficer: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Officers"],
    }),

    // Activate officer
    activateOfficer: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Officers"],
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}/reset-password`,
        method: "POST",
      }),
      invalidatesTags: ["Officers"],
    }),

    // Get expired password users
    getExpiredPasswordUsers: builder.query({
      query: () => "/admin/expired-passwords",
      providesTags: ["Officers"],
    }),


    // Office Management
    createOffice: builder.mutation({
      query: (officeData) => ({
        url: '/admin/offices',
        method: 'POST',
        body: officeData,
      }),
      invalidatesTags: [{ type: 'Office', id: 'LIST' }],
    }),

    updateOffice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/offices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Office', id: 'LIST' }],
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

    getAllCitizen: builder.query({
      query: () => ({
        url: "/admin/get-all-citizen",
        method: "GET"
      })
    }),

    lockCitizen: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/citizens/${id}/lock`,
        method: 'PATCH',
        body: { reason }
      }),
      invalidatesTags: ['Citizen'],
    }),

    unlockCitizen: builder.mutation({
      query: (id) => ({
        url: `/admin/citizens/${id}/unlock`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Citizen'],
    }),

    //setting-template
    getSystemSettings: builder.query({
      query: () => "/admin/system-settings",
      providesTags: ['Settings'],
    }),

    updateSystemSettings: builder.mutation({
      query: (data) => ({
        url: "/admin/system-settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),



  })
});

export const {
  useCreateOfficerMutation,
  useGetAllOfficersQuery,
  useUpdateOfficerMutation,
  useUnlockOfficerMutation,
  useLockOfficerMutation,
  useDeactivateOfficerMutation,
  useActivateOfficerMutation,
  useResetPasswordMutation,
  useGetExpiredPasswordUsersQuery,
  useCreateOfficeMutation,
  useUpdateOfficeMutation,
  useDeActivateOfficeMutation,
  useActivateOfficeMutation,
  useGetAllCitizenQuery,
  useLockCitizenMutation,
  useUnlockCitizenMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation
} = adminApi;