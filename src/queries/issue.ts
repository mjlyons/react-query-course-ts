import { QueryClient } from "@tanstack/react-query";
import {
  ApiQueryFunction,
  GetIssueArgs,
  GetIssueResponse,
  GetIssueQueryRpcName,
  GetIssuesError,
  UseApiQueryHook,
} from "../api";
import { fetchWithError, getQueryKeyFn, useApiQuery } from "../api_helpers";

export const GET_ISSUE_RPC_NAME: GetIssueQueryRpcName = "issue";

export const getIssueQueryKey = getQueryKeyFn("issue");

const queryFn: ApiQueryFunction<GetIssueQueryRpcName> = ({
  queryKey: [, args],
  signal,
}) => {
  return fetchWithError(`/api/issues/${args.issueNumber}`, { signal });
};

export const useGetIssueQuery: UseApiQueryHook<GetIssueQueryRpcName> = (
  args,
  options
) => useApiQuery(getIssueQueryKey(args), queryFn, options);

export const prefetchGetIssueQuery = (
  queryClient: QueryClient,
  args: GetIssueArgs
) => {
  queryClient.prefetchQuery(getIssueQueryKey(args), queryFn);
};
