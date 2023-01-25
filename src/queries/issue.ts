import { QueryClient } from "@tanstack/react-query";
import {
  ApiQueryFunction,
  GetIssueArgs,
  GetIssueResponse,
  GetIssueQueryRpcName,
  GetIssuesError,
  UseApiQueryHook,
} from "../api";
import { fetchWithError, getQueryKey, useApiQuery } from "../api_helpers";

export const GET_ISSUE_RPC_NAME: GetIssueQueryRpcName = "issue";

const queryFn: ApiQueryFunction<GetIssueQueryRpcName> = ({
  queryKey: [, args],
  signal,
}) => {
  return fetchWithError(`/api/issues/${args.issueNumber}`, { signal });
};

export const useGetIssueQuery: UseApiQueryHook<GetIssueQueryRpcName> = (
  args,
  options
) => useApiQuery([GET_ISSUE_RPC_NAME, args], queryFn, options);

export const prefetchGetIssueQuery = (
  queryClient: QueryClient,
  args: GetIssueArgs
) => {
  queryClient.prefetchQuery(getQueryKey(GET_ISSUE_RPC_NAME)(args), queryFn);
};
