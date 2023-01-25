import { createApiQuery, fetchWithError } from "../api_helpers";

export const searchIssuesAccess = createApiQuery({
  queryRpcName: "search/issues",
  queryFn:
    (args) =>
    ({ signal }) => {
      const url = new URL("/api/search/issues", window.location.origin);
      url.searchParams.append("q", args.searchTerm);
      return fetchWithError(url.toString(), { signal });
    },
});
