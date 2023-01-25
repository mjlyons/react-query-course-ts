import {
  SearchIssuesArgs,
  SearchIssuesResponse,
  SearchIssuesError,
  UseApiQueryHook,
  SearchIssuesQueryRpcName,
} from "../api";
import { fetchWithError, getQueryKeyFn, useApiQuery } from "../api_helpers";

export const SEARCH_ISSUES_QUERY_RPC_NAME = "search/issues";
export const getSearchIssuesQueryKey = getQueryKeyFn(
  SEARCH_ISSUES_QUERY_RPC_NAME
);

export const useSearchIssuesQuery: UseApiQueryHook<SearchIssuesQueryRpcName> = (
  args,
  options
) =>
  useApiQuery(
    getSearchIssuesQueryKey(args),
    ({ signal }) => {
      const url = new URL("/api/search/issues", window.location.origin);
      url.searchParams.append("q", args.searchTerm);
      return fetchWithError(url.toString(), { signal });
    },
    options
  );
