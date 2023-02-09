import { ApiQueryFunction } from "../api";
import {
  createApiInfiniteQuery,
  createApiQuery,
  fetchWithError,
} from "../api_helpers";

// export const issueCommentsAccess = createApiQuery({
//   queryRpcName: "issue/comments",
//   queryFn:
//     (args) =>
//     ({ signal }) =>
//       fetchWithError(`/api/issues/${args.issueNumber}/comments`, { signal }),
// });

export const issueCommentsInfAccess = createApiInfiniteQuery({
  queryRpcName: "issue/comments",
  queryFn:
    (args) =>
    ({ signal, pageParam = 1 }) =>
      fetchWithError(
        `/api/issues/${args.issueNumber}/comments?page=${pageParam}`,
        { signal }
      ),
  optionsFn: (options) => {
    return {
      ...options,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
    };
  },
});
