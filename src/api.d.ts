import {
  QueryClient,
  QueryFunction,
  UseQueryOptions,
} from "@tanstack/react-query";
import { Brand } from "../ts_utils";
import { STATUSES, useApiQuery } from "./api_helpers";

/**
 * COMMON RPC PRIMATIVES
 */
export type DateString = Brand<string, "DateString">;

export type UserId = Brand<string, "UserId">;
export type CommentId = Brand<string, "CommentId">;
export type IssueId = Brand<string, "IssueId">;
export type LabelId = Brand<string, "Label">;
export type IssueNumber = Brand<number, "IssueNumber">;
export type IssueStatus = typeof STATUSES[number];

export type Label = { id?: LabelId; color?: string; name?: string };
export type User = { id?: UserId; name?: string; profilePictureUrl?: string };
export type Issue = {
  assignee?: UserId | null;
  comments?: CommentId[];
  completedDate?: DateString | null;
  createdBy?: UserId;
  createdDate?: DateString;
  dueDate?: DateString | null;
  id?: IssueId;
  labels?: LabelId[];
  number?: IssueNumber;
  status?: IssueStatus;
  title?: string;
};
export type Comment = {
  id: string;
  comment?: string;
  createdBy?: UserId;
  createdDate?: DateString;
};

/**
 * RPC ENDPOINT DEFINITIONS
 */

// /api/issues
export type GetIssuesRpcName = "issues";
export type GetIssuesArgs = {
  labelsFilter?: LabelId[];
  statusFilter?: IssueStatus | null;
};
export type GetIssuesResponse = { items: Issue[] };
export type GetIssuesError = Error;

// /api/search/issues
export type SearchIssuesRpcName = "search/issues";
export type SearchIssuesArgs = {
  searchTerm: string;
};
export type SearchIssuesResponse = {
  count: number;
  items: Issue[];
};
export type SearchIssuesError = Error;

// /api/issues/{issueNumber}
export type GetIssueRpcName = "issue";
export type GetIssueArgs = {
  issueNumber: IssueNumber;
};
export type GetIssueResponse = Issue;
export type GetIssuesError = Error;

// /api/issues/{issueNumber}/comments
export type GetIssueCommentsRpcName = "issue/comments";
export type GetIssueCommentsArgs = {
  issueNumber: IssueNumber;
};
export type GetIssueCommentsResponse = Comment[];
export type GetIssueCommentsError = Error;

// /api/labels
export type GetLabelsRpcName = "labels";
export type GetLabelsArgs = {};
export type GetLabelsResponse = Label[];
export type GetLabelsError = Error;

// /api/users/{userId}
export type GetUserRpcName = "user";
export type GetUserArgs = { userId: string };
export type GetUserResponse = User | undefined;
export type GetUserError = Error;

// --- MUTATIONS ---

// /api/issues [MUTATION: add]
export type AddIssueArgs = {
  title: string;
  comment: string;
};
export type AddIssueResponse = Issue;
export type AddIssueError = Error;

/**
 * RPC TYPE LOOKUP
 */

type RpcNameToTypes = {
  issues: {
    args: GetIssuesArgs;
    response: GetIssuesResponse;
    error: GetIssuesError;
  };
  "search/issues": {
    args: SearchIssuesArgs;
    response: SearchIssuesResponse;
    error: SearchIssuesError;
  };
  issue: {
    args: GetIssueArgs;
    response: GetIssueResponse;
    error: GetIssuesError;
  };
  "issue/comments": {
    args: GetIssueCommentsArgs;
    response: GetIssueCommentsResponse;
    error: GetIssueCommentsError;
  };
  labels: {
    args: GetLabelsArgs;
    response: GetLabelsResponse;
    error: GetLabelsError;
  };
  user: {
    args: GetUserArgs;
    response: GetUserResponse;
    error: GetUserError;
  };
};

/* I wonder why I can't do `keyof RpcNameToTypes` */
// export type RpcName = keyof RpcNameToTypes;
export type RpcName =
  | "issues"
  | "search/issues"
  | "issue"
  | "issue/comments"
  | "labels"
  | "user";

/**
 * API GENERIC TYPE HELPERS
 */

export type ApiArgs = {};

export type ApiCacheKey<
  RpcNameT extends RpcName,
  ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"]
> = [RpcNameT, ArgsT];

export type ApiQueryFunction<
  RpcNameT extends RpcName,
  ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"],
  ResponseT = RpcNameToTypes[RpcNameT]["response"]
> = QueryFunction<ResponseT, ApiCacheKey<RpcNameT, ArgsT>>;

export type ApiQueryOptions<
  RpcNameT extends RpcName,
  ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"],
  ResponseT = RpcNameToTypes[RpcNameT]["response"],
  ErrorT = RpcNameToTypes[RpcNameT]["error"]
> = Omit<
  UseQueryOptions<ResponseT, ErrorT, ResponseT, ApiCacheKey<RpcNameT, ArgsT>>,
  "queryKey" | "queryFn"
>;

type ApiQueryKey<
  RpcName extends RpcNameT,
  ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"]
> = [RpcNameT, ArgsT];

export type UseApiQueryHook<
  RpcNameT extends RpcName,
  ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"],
  ResponseT = RpcNameToTypes[RpcNameT]["response"],
  ErrorT = RpcNameToTypes[RpcNameT]["error"]
> = (
  args: ArgsT,
  options: ApiQueryOptions<RpcNameT>
) => ReturnType<typeof useApiQuery<RpcNameT>>;

type NormalizerFn<
  RpcNameT extends RpcName,
  ResponseT = RpcNameToTypes[RpcNameT]["response"]
> = (data: ResponseT, queryClient: QueryClient) => void;
type Extensions<RpcNameT extends RpcName> = {
  normalizer?: NormalizerFn<RpcNameT>;
};
