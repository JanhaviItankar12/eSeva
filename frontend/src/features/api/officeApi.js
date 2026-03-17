import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const officeApi = createApi({
  reducerPath: "officeApi",
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

  tagTypes: ['Office', 'District', 'Tehsil', 'Gram'],
  endpoints: (builder) => ({
    getOffices: builder.query({
      query: ({ level, district, tehsil } = {}) => {
        let url = '/offices';
        const params = new URLSearchParams();
        if (level) params.append('level', level);
        if (district) params.append('district', district);
        if (tehsil) params.append('tehsil', tehsil);
        if (params.toString()) url += `?${params.toString()}`;
        return url;
      },
      providesTags: (result) => {
        const tags = [{ type: 'Office', id: 'LIST' }];
        if (result?.data) {
          result.data.forEach((office) => {
            tags.push({ type: 'Office', id: office._id });
            // Add specific tags based on office level
            if (office.officeLevel === 'DISTRICT') {
              tags.push({ type: 'District', id: office._id });
            } else if (office.officeLevel === 'TEHSIL') {
              tags.push({ type: 'Tehsil', id: office._id });
            } else if (office.officeLevel === 'GRAM') {
              tags.push({ type: 'Gram', id: office._id });
            }
          });
        }
        return tags;
      },
    }),
    getDistricts: builder.query({
      query: () => '/offices/districts',
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({
              type: 'District',
              id: _id
            })),
            { type: 'District', id: 'LIST' }
          ]
          : [{ type: 'District', id: 'LIST' }]
    }),
    getTehsils: builder.query({
      query: (districtId) => `/offices/tehsils/${districtId}`,
      providesTags: (result, error, districtId) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({
              type: 'Tehsil',
              id: _id
            })),
            { type: 'Tehsil', id: 'LIST' }
          ]
          : [{ type: 'Tehsil', id: 'LIST' }]
    }),
    getGramPanchayats: builder.query({
      query: (tehsilId) => `/offices/gram-panchayats/${tehsilId}`,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({
              type: 'Gram',
              id: _id
            })),
            { type: 'Gram', id: 'LIST' }
          ]
          : [{ type: 'Gram', id: 'LIST' }]
    }),

     getActiveDistricts: builder.query({
      query: () => '/offices/districts/active',
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({
              type: 'District',
              id: _id
            })),
            { type: 'District', id: 'LIST' }
          ]
          : [{ type: 'District', id: 'LIST' }]
    }),
    getActiveTehsils: builder.query({
      query: (districtId) => `/offices/tehsils/${districtId}/active`,
      providesTags: (result, error, districtId) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({
              type: 'Tehsil',
              id: _id
            })),
            { type: 'Tehsil', id: 'LIST' }
          ]
          : [{ type: 'Tehsil', id: 'LIST' }]
    }),
    getActiveGramPanchayats: builder.query({
      query: (tehsilId) => `/offices/gram-panchayats/${tehsilId}/active`,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({
              type: 'Gram',
              id: _id
            })),
            { type: 'Gram', id: 'LIST' }
          ]
          : [{ type: 'Gram', id: 'LIST' }]
    }),

    getOfficeById: builder.query({
      query: (id) => `/offices/${id}`,
      providesTags: (result, error, id) => {
        const tags = [{ type: 'Office', id }];
        if (result?.data) {
          if (result.data.officeLevel === 'DISTRICT') {
            tags.push({ type: 'District', id });
          } else if (result.data.officeLevel === 'TEHSIL') {
            tags.push({ type: 'Tehsil', id });
          } else if (result.data.officeLevel === 'GRAM') {
            tags.push({ type: 'Gram', id });
          }
        }
        return tags;
      },
    }),

    officerRoles:builder.query({
      query:()=>({
        url:"/offices/get-roles",
        method:'GET'
      })
    })


  })
});

export const {
  useGetOfficesQuery,
  useGetDistrictsQuery,
  useGetTehsilsQuery,
  useGetGramPanchayatsQuery,
  useGetOfficeByIdQuery,
  useGetActiveDistrictsQuery,
  useGetActiveTehsilsQuery,
  useGetActiveGramPanchayatsQuery,
  useOfficerRolesQuery

} = officeApi;
