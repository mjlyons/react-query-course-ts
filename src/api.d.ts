import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { Brand } from "../ts_utils";
import {
  STATUSES,
  useApiQuery,
  useApiMutation,
  useApiInfiniteQuery,
} from "./api_helpers";

// Makes `K` properties in `T` required
// https://stackoverflow.com/a/69328045
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * COMMON RPC PRIMATIVES
 */
export type DateString = Brand<string, "DateString">;

export type UserId = string;
export type CommentId = Brand<string, "CommentId">;
export type IssueId = Brand<string, "IssueId">;
export type LabelId = string;
export type IssueNumber = Brand<number, "IssueNumber">;

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
  status?: Status["id"];
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
  statusFilter?: string | null;
  pageNum?: number;
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

// /api/users
export type GetUsersQueryRpcName = "users";
export type GetUsersArgs = {};
export type GetUsersResponse = User[];
export type GetUsersError = Error;

// --- MUTATIONS ---

// /api/issues [MUTATION: add]
export type AddIssueArgs = {
  title: string;
  comment: string;
};
export type AddIssueResponse = Issue;
export type AddIssueError = Error;

// /api/issues/{issueNumber} [MUTATION: update]
export type UpdateIssueArgs = {
  issueNumber: IssueNumber;
  /** This is a status.id */
  status?: string;
  assignee?: UserId | null;
  labels?: LabelId[];
};
export type UpdateIssueResponse = {
  status: string;
  assignee: UserId | null;
};
export type UpdateIssueError = Error;

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
  users: {
    args: GetUsersArgs;
    response: GetUsersResponse;
    error: GetUsersError;
  };
};
export type QueryRpcName = keyof QueryRpcNameToTypes;

export type MutationRpcNameToTypes = {
  "issue/add": {
    args: AddIssueArgs;
    response: AddIssueResponse;
    error: AddIssueError;
  };
  "issue/update": {
    args: UpdateIssueArgs;
    response: UpdateIssueResponse;
    error: UpdateIssueError;
  };
};
export type MutationRpcName = keyof MutationRpcNameToTypes;

/**
 * API GENERIC TYPE HELPERS
 */

export type ApiArgs = {};
export type QueryKeyModifier = "query" | "infquery";

export type ApiQueryKey<
  QueryRpcNameT extends QueryRpcName,
  QueryKeyModifierT extends QueryKeyModifier
> = [QueryRpcNameT, ApiQueryArgs<QueryRpcNameT>, QueryKeyModifierT];

export type ApiMutationKey<MutationRpcNameT extends MutationRpcName> = [
  MutationRpcNameT
];

export type ApiQueryFunction<
  QueryRpcNameT extends QueryRpcName,
  QueryKeyModifierT extends QueryKeyModifier
> = (
  args: ApiQueryArgs<QueryRpcNameT>
) => QueryFunction<
  ApiQueryResponse<QueryRpcNameT>,
  ApiQueryKey<QueryRpcNameT, QueryKeyModifierT>
>;

export type ApiMutationFunction<MutationRpcNameT extends MutationRpcName> =
  MutationFunction<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryArgs<QueryRpcNameT>
  >;

export type ApiQueryOptions<QueryRpcNameT extends QueryRpcName> = Omit<
  UseQueryOptions<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryError<QueryResponseT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryKey<QueryRpcNameT, "query">
  >,
  "queryKey" | "queryFn"
>;

export type ApiInfiniteQueryOptions<QueryRpcNameT extends QueryRpcName> =
  UseInfiniteQueryOptions<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryError<QueryResponseT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryKey<QueryRpcNameT, "infquery">
  >;

export type ApiMutationOptions<
  MutationRpcNameT extends MutationRpcName,
  ArgsT extends ApiArgs = MutationRpcNameToTypes[MutationRpcNameT]["args"],
  ResponseT = MutationRpcNameToTypes[MutationRpcNameT]["response"],
  ErrorT = MutationRpcNameToTypes[MutationRpcNameT]["error"]
> = Omit<
  UseMutationOptions<ResponseT, ErrorT, ArgsT, MutationContext>,
  "mutationFn"
>;

export type ApiQueryArgs<QueryRpcNameT extends QueryRpcName> =
  QueryRpcNameToTypes[QueryRpcNameT]["args"];

export type ApiMutationArgs<
  MutationRpcNameT extends MutationRpcName,
  ArgsT extends ApiArgs
> = MutationRpcNameToTypes[MutationRpcNameT]["args"];

export type ApiQueryResponse<QueryRpcNameT extends QueryRpcName> =
  QueryRpcNameToTypes[QueryRpcNameT]["response"];

export type ApiQueryError<QueryRpcNameT extends QueryRpcName> = ErrorT;

export type ApiQuerySelectFn<
  QueryRpcNameT extends QueryRpcName,
  SelectDataT
> = (origData: ApiQueryResponse<QueryRpcNameT>) => SelectDataT;

export type GetQueryKeyFn<
  QueryRpcNameT extends QueryRpcName,
  QueryKeyModifierT extends QueryKeyModifier
> = (
  args: ArgsT
) => [QueryRpcNameT, ApiQueryArgs<QueryRpcNameT>, QueryKeyModifierT];

export type UseApiQueryHook<QueryRpcNameT extends QueryRpcName> = (
  args: QueryRpcNameToTypes[QueryRpcNameT]["args"],
  options?: ApiQueryOptions<QueryRpcNameT>
) => ReturnType<typeof useApiQuery<QueryRpcNameT>>;

export type UseApiInfiniteQueryHook<QueryRpcNameT extends QueryRpcName> = (
  args: ApiQueryArgs<QueryRpcNameT>,
  options?: ApiInfiniteQueryOptions<QueryRpcNameT>
) => ReturnType<typeof useApiInfiniteQuery<QueryRpcNameT>>;

export type ApiQueryOptionsFn<QueryRpcNameT extends QueryRpcName> = (
  options: ApiQueryOptions<QueryRpcNameT>
) => ApiQueryOptions<QueryRpcNameT>;

export type ApiInfiniteQueryOptionsFn<QueryRpcNameT extends QueryRpcName> = (
  options: ApiInfiniteQueryOptions<QueryRpcNameT>
) => WithRequired<ApiInfiniteQueryOptions<QueryRpcNameT>, "getNextPageParam">;

export type ApiMutationOptionsFn<MutationRpcNameT extends MutationRpcName> = (
  options: ApiMutationOptions<MutationRpcNameT>
) => ApiMutationOptions<MutationRpcNameT>;

export type CommonQueryHookPackageFunctions<
  QueryRpcNameT extends QueryRpcName
> = {
  getQueryData: (
    queryClient: QueryClient,
    args: ApiQueryArgs<QueryRpcNameT>
  ) => ApiQueryResponse<QueryRpcNameT>;
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

export type ApiQueryHookPackage<QueryRpcNameT extends QueryRpcName> = {
  queryRpcName: QueryRpcNameT;
  queryFn: ApiQueryFunction<QueryRpcNameT>;
  getQueryKey: GetQueryKeyFn<QueryRpcNameT, "query">;
  useRpcQuery: UseApiQueryHook<QueryRpcNameT>;
  prefetch: (
    queryClient: QueryClient,
    args: ApiQueryArgs<QueryRpcNameT>
  ) => void;
} & CommonQueryHookPackageFunctions<QueryRpcNameT>;

export type ApiInfiniteQueryHookPackage<QueryRpcNameT extends QueryRpcName> =
  CommonQueryHookPackageFunctions<QueryRpcNameT> & {
    queryRpcName: QueryRpcNameT;
    queryFn: ApiQueryFunction<QueryRpcNameT>;
    getQueryKey: GetQueryKeyFn<QueryRpcNameT, "infquery">;
    useRpcInfiniteQuery: UseApiInfiniteQueryHook<QueryRpcNameT>;
    prefetchInfinite: (
      queryClient: QueryClient,
      args: ApiQueryArgs<QueryRpcNameT>
    ) => void;
  };

export type UseApiMutationHook<MutationRpcNameT extends MutationRpcName> = (
  options: ApiMutationOptions<MutationRpcNameT> = {}
) => ReturnType<typeof useApiMutation<MutationRpcNameT>>;

export type ApiMutationHookPackage<MutationRpcNameT extends MutationRpcName> = {
  mutationRpcName: MutationRpcNameT;
  mutationFn: ApiMutationFunction<MutationRpcNameT>;
  useRpcMutation: UseApiMutationHook<MutationRpcNameT>;
};

export type MutationContext = {
  rollback?: () => void;
};
