import { baseQuery } from "../features/api/citizenApi";
import { logout } from "../services/authSlice";

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};
