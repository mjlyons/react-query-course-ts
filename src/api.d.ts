import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  UseMutationOptions,
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
export type GetIssuesQueryRpcName = "issues";
export type GetIssuesArgs = {
  labelsFilter?: LabelId[];
  statusFilter?: IssueStatus | null;
};
export type GetIssuesResponse = { items: Issue[] };
export type GetIssuesError = Error;

// /api/search/issues
export type SearchIssuesQueryRpcName = "search/issues";
export type SearchIssuesArgs = {
  searchTerm: string;
};
export type SearchIssuesResponse = {
  count: number;
  items: Issue[];
};
export type SearchIssuesError = Error;

// /api/issues/{issueNumber}
export type GetIssueQueryRpcName = "issue";
export type GetIssueArgs = {
  issueNumber: IssueNumber;
};
export type GetIssueResponse = Issue;
export type GetIssuesError = Error;

// /api/issues/{issueNumber}/comments
export type GetIssueCommentsQueryRpcName = "issue/comments";
export type GetIssueCommentsArgs = {
  issueNumber: IssueNumber;
};
export type GetIssueCommentsResponse = Comment[];
export type GetIssueCommentsError = Error;

// /api/labels
export type GetLabelsQueryRpcName = "labels";
export type GetLabelsArgs = {};
export type GetLabelsResponse = Label[];
export type GetLabelsError = Error;

// /api/users/{userId}
export type GetUserQueryRpcName = "user";
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

type QueryRpcNameToTypes = {
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

/* I wonder why I can't do `keyof QueryRpcNameToTypes` */
// export type QueryRpcName = keyof QueryRpcNameToTypes;
export type QueryRpcName =
  | "issues"
  | "search/issues"
  | "issue"
  | "issue/comments"
  | "labels"
  | "user";

type AddIssueMutationRpcName = "issue";
type AddIssueArgs = {
  title: string;
  comment: string;
};
type AddIssueResponse = Issue;
type AddIssueError = Error;

export type MutationRpcNameToTypes = {
  issue: {
    args: AddIssueArgs;
    response: AddIssueResponse;
    error: AddIssueError;
  };
};

export type MutationRpcName = "issue";

/**
 * API GENERIC TYPE HELPERS
 */

export type ApiArgs = {};

export type ApiQueryKey<
  QueryRpcNameT extends QueryRpcName,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"]
> = [QueryRpcNameT, ArgsT];

export type ApiMutationKey<MutationRpcNameT extends MutationRpcName> = [
  MutationRpcNameT
];

export type ApiQueryFunction<
  QueryRpcNameT extends QueryRpcName,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"],
  ResponseT = QueryRpcNameToTypes[QueryRpcNameT]["response"]
> = (
  args: ArgsT
) => QueryFunction<ResponseT, ApiQueryKey<QueryRpcNameT, ArgsT>>;

export type ApiMutationFunction<
  MutationRpcNameT extends MutationRpcName,
  ArgsT extends ApiArgs = MutationRpcNameToTypes[MutationRpcNameT]["args"],
  ResponseT = MutationyRpcNameToTypes[MutationRpcNameT]["response"]
> = MutationFunction<ResponseT, ArgsT>;

export type ApiQueryOptions<
  QueryRpcNameT extends QueryRpcName,
  DataT = ApiQueryResponse<QueryRpcNameT>,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"],
  ResponseT = QueryRpcNameToTypes[QueryRpcNameT]["response"],
  ErrorT = QueryRpcNameToTypes[QueryRpcNameT]["error"]
> = Omit<
  UseQueryOptions<ResponseT, ErrorT, DataT, ApiQueryKey<QueryRpcNameT, ArgsT>>,
  "queryKey" | "queryFn"
>;

export type ApiMutationOptions<
  MutationRpcNameT extends MutationRpcName,
  ArgsT extends ApiArgs = MutationRpcNameToTypes[MutationRpcNameT]["args"],
  ResponseT = MutationRpcNameToTypes[MutationRpcNameT]["response"],
  ErrorT = MutationRpcNameToTypes[MutationRpcNameT]["error"]
> = Omit<UseMutationOptions<ResponseT, ErrorT, ArgsT>, "mutationFn">;

type ApiQueryKey<
  QueryRpcNameT extends QueryRpcName,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"]
> = [QueryRpcNameT, ArgsT];

export type ApiQueryArgs<
  QueryRpcNameT extends QueryRpcName,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"]
> = ArgsT;

export type ApiMutationArgs<
  MutationRpcNameT extends MutationRpcName,
  ArgsT extends ApiArgs = MutationRpcNameToTypes[MutationRpcNameT]["args"]
> = ArgsT;

export type ApiQueryResponse<
  QueryRpcNameT extends QueryRpcName,
  ResponseT = QueryRpcNameToTypes[QueryRpcNameT]["response"]
> = ResponseT;

export type ApiQueryError<
  QueryRpcNameT extends QueryRpcName,
  ErrorT = QueryRpcNameToTypes[QueryRpcNameT]["error"]
> = ErrorT;

export type ApiQuerySelectFn<
  QueryRpcNameT extends QueryRpcName,
  SelectDataT
> = (origData: ApiQueryResponse<QueryRpcNameT>) => SelectDataT;

export type GetQueryKeyFn<
  QueryRpcNameT extends QueryRpcName,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"]
> = (args: ArgsT) => [QueryRpcNameT, ArgsT];

export type UseApiQueryHook<
  QueryRpcNameT extends QueryRpcName,
  DataT = ApiQueryResponse<QueryRpcNameT>,
  ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"],
  ResponseT = QueryRpcNameToTypes[QueryRpcNameT]["response"],
  ErrorT = QueryRpcNameToTypes[QueryRpcNameT]["error"]
> = (
  args: ArgsT,
  options?: ApiQueryOptions<QueryRpcNameT, DataT>
) => ReturnType<typeof useApiQuery<QueryRpcNameT, DataT>>;

export type ApiQueryOptionsFn<
  QueryRpcNameT extends QueryRpcName,
  DataT = ApiQueryResponse<QueryRpcNameT>
> = (
  options: ApiQueryOptions<QueryRpcNameT, DataT>
) => ApiQueryOptions<QueryRpcNameT, DataT>;

export type ApiMutationOptionsFn<MutationRpcNameT extends MutationRpcName> = (
  options: ApiMutationOptions<MutationRpcNameT>
) => ApiMutationOptions<MutationRpcNameT>;

export type ApiQueryHookPackage<
  QueryRpcNameT extends QueryRpcName,
  DataT = ApiQueryResponse<QueryRpcNameT>
> = {
  queryRpcName: QueryRpcNameT;
  getQueryKey: GetQueryKeyFn<QueryRpcNameT>;
  queryFn: ApiQueryFunction<QueryRpcNameT>;
  useRpcQuery: UseApiQueryHook<QueryRpcNameT, DataT>;
  prefetch: (
    queryClient: QueryClient,
    args: ApiQueryArgs<QueryRpcNameT>
  ) => void;
  setQueryData: (
    queryClient: QueryClient,
    args: ApiQueryArgs<QueryRpcNameT>,
    data: ApiQueryResponse<QueryRpcNameT>
  ) => void;
  /**
   * if `args` is provided, will only invalidate RPC response for that set of args. If
   * `args` is ommitted, will invalidate RPC responses for all previous calls.
   */
  invalidateQueries: (
    queryClient: QueryClient,
    args?: ApiQueryArgs<QueryRpcNameT>
  ) => void;
};

export type UseApiMutationHook<
  MutationRpcNameT extends MutationRpcName,
  ArgsT extends ApiArgs = MutationRpcNameToTypes[MutationRpcNameT]["args"],
  ResponseT = MutationRpcNameToTypes[MutationRpcNameT]["response"],
  ErrorT = MutationRpcNameToTypes[MutationRpcNameT]["error"]
> = (
  options: ApiMutationOptions<MutationRpcNameT> = {}
) => ReturnType<typeof useApiMutation<MutationRpcNameT>>;

export type ApiMutationHookPackage<MutationRpcNameT extends MutationRpcName> = {
  mutationRpcName: MutationRpcNameT;
  mutationFn: ApiMutationFunction<MutationRpcNameT>;
  useRpcMutation: UseApiMutationHook<MutationRpcNameT>;
};
