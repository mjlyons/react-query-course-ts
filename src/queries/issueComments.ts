import { createApiQuery, fetchWithError } from "../api_helpers";

export const issueCommentsAccess = createApiQuery({
  queryRpcName: "issue/comments",
  queryFn:
    (args) =>
    ({ signal }) =>
      fetchWithError(`/api/issues/${args.issueNumber}/comments`, { signal }),
});
