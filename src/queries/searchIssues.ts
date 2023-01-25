import {
  SearchIssuesArgs,
  SearchIssuesResponse,
  SearchIssuesError,
  UseApiQueryHook,
} from "../api";
import { createUseApiQuery, fetchWithError } from "../api_helpers";

export const useSearchIssuesQuery: UseApiQueryHook<
  "search/issues",
  SearchIssuesArgs,
  SearchIssuesResponse,
  SearchIssuesError
> = createUseApiQuery("search/issues", ({ queryKey: [, args], signal }) => {
  const url = new URL("/api/search/issues", window.location.origin);
  url.searchParams.append("q", args.searchTerm);
  return fetchWithError(url.toString(), { signal });
});
