import { createApiQuery, fetchWithError } from "../api_helpers";

export const usersAccess = createApiQuery({
  queryRpcName: "users",
  queryFn:
    (args) =>
    ({ signal }) => {
      return fetchWithError(`/api/users`, { signal });
    },
  optionsFn: (options) => ({
    staleTime: 5 * 60 * 1000, // 5 min
    ...options,
  }),
});
