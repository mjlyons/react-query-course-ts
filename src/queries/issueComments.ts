import { QueryClient } from "@tanstack/react-query";
import {
  ApiQueryFunction,
  GetIssueCommentsArgs,
  GetIssueCommentsError,
  GetIssueCommentsResponse,
  GetIssueCommentsRpcName,
  UseApiQueryHook,
} from "../api";
import { createUseApiQuery, fetchWithError, getCacheKey } from "../api_helpers";

const GET_ISSUE_COMMENTS_RPC_NAME: GetIssueCommentsRpcName = "issue/comments";

const queryFn: ApiQueryFunction<GetIssueCommentsRpcName> = ({
  queryKey: [, args],
  signal,
}) => fetchWithError(`/api/issues/${args.issueNumber}/comments`, { signal });

export const useGetIssueCommentsQuery = createUseApiQuery(
  GET_ISSUE_COMMENTS_RPC_NAME,
  queryFn
);

export const prefetchGetIssueCommentsQuery = (
  queryClient: QueryClient,
  args: GetIssueCommentsArgs
) => {
  queryClient.prefetchQuery(
    getCacheKey(GET_ISSUE_COMMENTS_RPC_NAME)(args),
    queryFn
  );
};
