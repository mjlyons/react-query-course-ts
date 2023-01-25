import { QueryClient } from "@tanstack/react-query";
import {
  ApiQueryFunction,
  GetIssueCommentsArgs,
  GetIssueCommentsError,
  GetIssueCommentsResponse,
  GetIssueCommentsQueryRpcName,
  UseApiQueryHook,
} from "../api";
import { fetchWithError, getQueryKeyFn, useApiQuery } from "../api_helpers";

const GET_ISSUE_COMMENTS_RPC_NAME: GetIssueCommentsQueryRpcName =
  "issue/comments";
const getIssueCommentsQueryKey = getQueryKeyFn(GET_ISSUE_COMMENTS_RPC_NAME);

const queryFn: ApiQueryFunction<GetIssueCommentsQueryRpcName> = ({
  queryKey: [, args],
  signal,
}) => fetchWithError(`/api/issues/${args.issueNumber}/comments`, { signal });

export const useGetIssueCommentsQuery: UseApiQueryHook<
  GetIssueCommentsQueryRpcName
> = (args, options) => {
  return useApiQuery(getIssueCommentsQueryKey(args), queryFn, options);
};

export const prefetchGetIssueCommentsQuery = (
  queryClient: QueryClient,
  args: GetIssueCommentsArgs
) => {
  queryClient.prefetchQuery(getIssueCommentsQueryKey(args), queryFn);
};
