import { QueryClient } from "@tanstack/react-query";
import {
  ApiQueryFunction,
  GetIssueArgs,
  GetIssueResponse,
  GetIssueRpcName,
  GetIssuesError,
  UseApiQueryHook,
} from "../api";
import { createUseApiQuery, fetchWithError, getCacheKey } from "../api_helpers";

export const GET_ISSUE_RPC_NAME: GetIssueRpcName = "issue";

const queryFn: ApiQueryFunction<GetIssueRpcName> = ({
  queryKey: [, args],
  signal,
}) => {
  return fetchWithError(`/api/issues/${args.issueNumber}`, { signal });
};

export const useGetIssueQuery: UseApiQueryHook<GetIssueRpcName> =
  createUseApiQuery("issue", queryFn);

export const precacheGetIssueQuery = (
  queryClient: QueryClient,
  args: GetIssueArgs,
  data: GetIssueResponse
) => {
  queryClient.setQueryData(getCacheKey(GET_ISSUE_RPC_NAME)(args), data);
};

export const prefetchGetIssueQuery = (
  queryClient: QueryClient,
  args: GetIssueArgs
) => {
  queryClient.prefetchQuery(getCacheKey(GET_ISSUE_RPC_NAME)(args), queryFn);
};
