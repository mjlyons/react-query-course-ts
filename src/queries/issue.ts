import { createApiQuery, fetchWithError } from "../api_helpers";

export const issueAccess = createApiQuery({
  queryRpcName: "issue",
  queryFn:
    (args) =>
    ({ signal }) => {
      return fetchWithError(`/api/issues/${args.issueNumber}`, { signal });
    },
});
