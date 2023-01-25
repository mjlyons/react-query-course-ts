import { useCallback } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ApiArgs,
  ApiQueryKey,
  ApiQueryFunction,
  UseApiQueryHook,
  IssueStatus,
  ApiQueryOptions,
  QueryRpcName,
  QueryRpcNameToTypes,
  MutationRpcName,
  MutationRpcNameToTypes,
  // QueryExtensions,
  MutationExtensions,
  ApiMutationFunction,
  ApiMutationOptions,
  UseApiMutationHook,
} from "./api";

export const useApiQuery = <
  QueryRpcNameT extends QueryRpcName,
  ResponseT = QueryRpcNameToTypes[QueryRpcNameT]["response"],
  ErrorT = QueryRpcNameToTypes[QueryRpcNameT]["error"]
>(
  queryKey: ApiQueryKey<QueryRpcNameT>,
  queryFn: Parameters<
    typeof useQuery<ResponseT, ErrorT, ResponseT, ApiQueryKey<QueryRpcNameT>>
  >[1],
  options: Parameters<
    typeof useQuery<ResponseT, ErrorT, ResponseT, ApiQueryKey<QueryRpcNameT>>
  >[2]
): ReturnType<
  typeof useQuery<ResponseT, ErrorT, ResponseT, ApiQueryKey<QueryRpcNameT>>
> =>
  useQuery<ResponseT, ErrorT, ResponseT, ApiQueryKey<QueryRpcNameT>>(
    queryKey,
    queryFn,
    options
  );

export const useApiMutation = <
  MutationRpcNameT extends MutationRpcName,
  ArgsT = MutationRpcNameToTypes[MutationRpcNameT]["args"],
  ResponseT = MutationRpcNameToTypes[MutationRpcNameT]["response"],
  ErrorT = MutationRpcNameToTypes[MutationRpcNameT]["error"]
>(
  mutationRpcName: MutationRpcNameT,
  mutationFn: Parameters<typeof useMutation<ResponseT, ErrorT, ArgsT>>[1],
  options: Parameters<typeof useMutation<ResponseT, ErrorT, ArgsT>>[2] = {}
): ReturnType<typeof useMutation<ResponseT, ErrorT, ArgsT>> =>
  useMutation<ResponseT, ErrorT, ArgsT>(
    getMutationKey(mutationRpcName),
    mutationFn,
    options
  );

// export const createUseApiQuery = <QueryRpcNameT extends QueryRpcName>(
//   QueryRpcName: QueryRpcNameT,
//   rpcFn: ApiQueryFunction<QueryRpcNameT>,
//   defaultOptions?: ApiQueryOptions<QueryRpcNameT>,
//   extensions: QueryExtensions<QueryRpcNameT> = {}
// ): UseApiQueryHook<QueryRpcNameT> => {
//   return (args, options) => {
//     const queryClient = useQueryClient();
//     const wrappedRpcFn: typeof rpcFn = useCallback(
//       async (...args) => {
//         const data = await rpcFn(...args);
//         extensions.normalizer?.(data, queryClient);
//         return data;
//       },
//       [queryClient, extensions?.normalizer, rpcFn]
//     );
//     return useApiQuery<QueryRpcNameT>([QueryRpcName, args], wrappedRpcFn, {
//       ...defaultOptions,
//       ...options,
//     });
//   };
// };

// export const createUseApiMutation = <MutationRpcNameT extends MutationRpcName>(
//   MutationRpcName: MutationRpcNameT,
//   rpcFn: ApiMutationFunction<MutationRpcNameT>,
//   defaultOptions?: ApiMutationOptions<MutationRpcNameT>,
//   extensions: MutationExtensions<MutationRpcNameT> = {}
// ): UseApiMutationHook<MutationRpcNameT> => {
//   return (args, options) => {
//     // const queryClient = useQueryClient();
//     return useApiMutation<MutationRpcNameT>([MutationRpcName, args], rpcFn, {
//       ...defaultOptions,
//       ...options,
//     });
//   };
// };

export const getQueryKey =
  <
    QueryRpcNameT extends QueryRpcName,
    ArgsT extends ApiArgs = QueryRpcNameToTypes[QueryRpcNameT]["args"]
  >(
    queryRpcName: QueryRpcNameT
  ): ((args: ArgsT) => [QueryRpcNameT, ArgsT]) =>
  (args: ArgsT) => {
    return [queryRpcName, args];
  };

export const getQueryKeyRpcFilter = <QueryRpcNameT extends QueryRpcName>(
  queryRpcName: QueryRpcNameT
): [QueryRpcNameT] => {
  return [queryRpcName];
};

export const getMutationKey = <MutationRpcNameT extends MutationRpcName>(
  mutationRpcName: MutationRpcNameT
): [MutationRpcNameT] => {
  return [mutationRpcName];
};

export const GET_ISSUES_RPC_NAME = "issues";
export const precache = <
  QueryRpcNameT extends QueryRpcName,
  ArgsT extends ApiArgs,
  ResponseT
>(
  queryClient: QueryClient,
  QueryRpcName: QueryRpcNameT,
  args: ArgsT,
  data: ResponseT
) => {
  queryClient.setQueryData(
    getQueryKey<QueryRpcNameT, ArgsT>(QueryRpcName)(args),
    data
  );
};

export function isValid<T>(x: T | undefined | null): x is T {
  return x !== undefined && x !== null;
}
export const isStatusClosed = (
  status: IssueStatus | null | undefined
): boolean => status === "done" || status === "cancelled";
export const isStatusOpen = (status: IssueStatus | null): boolean =>
  !isStatusClosed(status);

export const STATUSES = [
  "backlog",
  "todo",
  "inProgress",
  "done",
  "cancelled",
] as const;

export const fetchWithError = async <ResponseT>(
  ...params: Parameters<typeof fetch>
): Promise<ResponseT> => {
  const res = await fetch(...params);

  if (res.status !== 200) {
    throw new Error(`Error in request (status=${res.status})`);
  }

  const result = await res.json();
  if (result.error) {
    throw new Error(`Error decoding JSON: ${result.error}`);
  }

  return result;
};
