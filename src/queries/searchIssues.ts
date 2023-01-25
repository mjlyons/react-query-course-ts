import {
  SearchIssuesArgs,
  SearchIssuesResponse,
  SearchIssuesError,
  UseApiQueryHook,
  SearchIssuesQueryRpcName,
} from "../api";
import { fetchWithError, useApiQuery } from "../api_helpers";

export const SEARCH_ISSUES_QUERY_RPC_NAME = "search/issues";

export const useSearchIssuesQuery: UseApiQueryHook<SearchIssuesQueryRpcName> = (
  //createUseApiQuery(
  args,
  options
) =>
  useApiQuery(
    [SEARCH_ISSUES_QUERY_RPC_NAME, args],
    ({ signal }) => {
      const url = new URL("/api/search/issues", window.location.origin);
      url.searchParams.append("q", args.searchTerm);
      return fetchWithError(url.toString(), { signal });
    },
    options
  );
