import { QueryClient } from "@tanstack/react-query";
import {
  ApiQueryFunction,
  GetIssueCommentsArgs,
  GetIssueCommentsError,
  GetIssueCommentsResponse,
  GetIssueCommentsQueryRpcName,
  UseApiQueryHook,
} from "../api";
import { fetchWithError, getQueryKey, useApiQuery } from "../api_helpers";

const GET_ISSUE_COMMENTS_RPC_NAME: GetIssueCommentsQueryRpcName =
  "issue/comments";

const queryFn: ApiQueryFunction<GetIssueCommentsQueryRpcName> = ({
  queryKey: [, args],
  signal,
}) => fetchWithError(`/api/issues/${args.issueNumber}/comments`, { signal });

// export const useGetIssueCommentsQuery = createUseApiQuery(
//   GET_ISSUE_COMMENTS_RPC_NAME,
//   queryFn
// );
export const useGetIssueCommentsQuery: UseApiQueryHook<
  GetIssueCommentsQueryRpcName
> = (args, options) => {
  return useApiQuery(GET_ISSUE_COMMENTS_RPC_NAME, args, queryFn, options);
};

export const prefetchGetIssueCommentsQuery = (
  queryClient: QueryClient,
  args: GetIssueCommentsArgs
) => {
  queryClient.prefetchQuery(
    getQueryKey(GET_ISSUE_COMMENTS_RPC_NAME)(args),
    queryFn
  );
};
