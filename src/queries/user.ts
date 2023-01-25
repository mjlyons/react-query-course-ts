import { createApiQuery, fetchWithError } from "../api_helpers";

export const userAccess = createApiQuery({
  queryRpcName: "user",
  queryFn:
    (args) =>
    ({ signal }) => {
      return fetchWithError(`/api/users/${args.userId}`, { signal });
    },
  optionsFn: (options) => ({
    staleTime: 5 * 60 * 1000, // 5 min
    ...options,
  }),
});
