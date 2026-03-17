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
  tagTypes: ['Officer', "Officers", 'Office', 'District', 'Tehsil', 'Gram', 'Settings','Backups', 'Schedules'],
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
      query: () => "/admin/get/system-settings",
      providesTags: ['Settings'],
    }),

    updateSystemSettings: builder.mutation({
      query: (data) => ({
        url: "/admin/update/system-settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    createCertificate: builder.mutation({
      query: (formData) => ({
        url: '/admin/create/certificate',
        method: 'POST',
        body: formData
      })
    }),

    updateCertificate: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/certificate/${id}`,
        method: 'PUT',
        body: { formData }
      })
    }),

    toggleCertificate: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/toggle-certificate-status/${id}`,
        method: 'PATCH',
        body: { isActive }
      })
    }),



    allCertificates: builder.query({
      query: () => ({
        url: '/admin/certificates/all',
        method: 'GET'
      })
    }),

    certificateById: builder.query({
      query: (id) => ({
        url: `/admin/certificate/${id}`,
        method: 'GET'
      })
    }),


    //system logs
    getLogs: builder.query({
      query: (params) => ({
        url: `/admin/logs`,
        method: "GET",
        params
      })
    }),

    clearLogs: builder.mutation({
      query: (params) => ({
        url: `/admin/logs`,
        method: "DELETE",
        params //filter
      })
    }),


     //  GET BACKUP HISTORY
    getBackups: builder.query({
      query: () => ({
        url: "/admin/backups",
        method: "GET"
      }),
      providesTags: ['Backups']
    }),

    //  CREATE BACKUP
    createBackup: builder.mutation({
      query: () => ({
        url: "/admin/backups",
        method: "POST"
      }),
      invalidatesTags: ['Backups']
    }),

    //  GET SCHEDULES
    getSchedules: builder.query({
      query: () => ({
        url: "/admin/schedules",
        method: "GET"
      }),
      providesTags: ['Schedules']
    }),

    //  GET STORAGE INFO
    getStorage: builder.query({
      query: () => ({
        url: "/admin/storage",
        method: "GET"
      })
    }),

    //  RESTORE BACKUP
    restoreBackup: builder.mutation({
      query: (id) => ({
        url: `/admin/backups/${id}/restore`,
        method: "POST"
      }),
      invalidatesTags: ["Backups"]
    }),

    //  DELETE BACKUP
    deleteBackup: builder.mutation({
      query: (id) => ({
        url: `/admin/backups/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Backups"]
    }),

    //  CREATE SCHEDULE
    createSchedule: builder.mutation({
      query: (data) => ({
        url: "/admin/schedules",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Schedules"]
    }),

    // UPDATE SCHEDULE
    updateSchedule: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/schedules/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Schedules"]
    }),

    //  DELETE SCHEDULE
    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: `/admin/schedules/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Schedules"]
    }),

    //  TOGGLE SCHEDULE (ACTIVE/INACTIVE)
    toggleSchedule: builder.mutation({
      query: (id) => ({
        url: `/admin/schedules/${id}/toggle`,
        method: "PATCH"
      }),
      invalidatesTags: ["Schedules"]
    }),

    //  UPDATE BACKUP SETTINGS
    updateBackupSettings: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/backup",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Settings"]
    }),

    getBackupSettings: builder.query({
      query: () => ({
        url: "/admin/settings/backup",
        method: "GET",
        
      }),
      invalidatesTags: ["Settings"]
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
  useUpdateSystemSettingsMutation,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useAllCertificatesQuery,
  useToggleCertificateMutation,
  useCertificateByIdQuery,
  useGetLogsQuery,
  useClearLogsMutation,
  useCreateBackupMutation,
  useGetBackupsQuery,
  useGetSchedulesQuery,
  useGetStorageQuery,
  useRestoreBackupMutation,
  useCreateScheduleMutation,
  useDeleteBackupMutation,
  useDeleteScheduleMutation,
  useUpdateScheduleMutation,
  useToggleScheduleMutation,
  useUpdateBackupSettingsMutation,
  useGetBackupSettingsQuery
} = adminApi;