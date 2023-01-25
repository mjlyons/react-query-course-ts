import { useCallback } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApiArgs,
  ApiCacheKey,
  ApiQueryFunction,
  UseApiQueryHook,
  IssueStatus,
  ApiQueryOptions,
  Extensions,
  RpcName,
  GetIssuesArgs,
  RpcNameToTypes,
} from "./api";

export const useApiQuery = <
  RpcNameT extends RpcName,
  //ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"],
  ResponseT = RpcNameToTypes[RpcNameT]["response"],
  ErrorT = RpcNameToTypes[RpcNameT]["error"]
>(
  ...params: Parameters<
    typeof useQuery<ResponseT, ErrorT, ResponseT, ApiCacheKey<RpcNameT>>
  >
): ReturnType<
  typeof useQuery<ResponseT, ErrorT, ResponseT, ApiCacheKey<RpcNameT>>
> => useQuery<ResponseT, ErrorT, ResponseT, ApiCacheKey<RpcNameT>>(...params);

export const createUseApiQuery = <RpcNameT extends RpcName>(
  rpcName: RpcNameT,
  rpcFn: ApiQueryFunction<RpcNameT>,
  defaultOptions?: ApiQueryOptions<RpcNameT>,
  extensions: Extensions<RpcNameT> = {}
): UseApiQueryHook<RpcNameT> => {
  return (args, options) => {
    const queryClient = useQueryClient();
    const wrappedRpcFn: typeof rpcFn = useCallback(
      async (...args) => {
        const data = await rpcFn(...args);
        extensions.normalizer?.(data, queryClient);
        return data;
      },
      [queryClient, extensions?.normalizer, rpcFn]
    );
    return useApiQuery<RpcNameT>([rpcName, args], wrappedRpcFn, {
      ...defaultOptions,
      ...options,
    });
  };
};

export const getCacheKey =
  <
    RpcNameT extends RpcName,
    ArgsT extends ApiArgs = RpcNameToTypes[RpcNameT]["args"]
  >(
    rpcName: RpcNameT
  ): ((args: ArgsT) => [RpcNameT, ArgsT]) =>
  (args: ArgsT) => {
    return [rpcName, args];
  };

export const getCacheKeyRpcFilter = <RpcNameT extends RpcName>(
  rpcName: RpcNameT
): [RpcNameT] => {
  return [rpcName];
};

export const GET_ISSUES_RPC_NAME = "issues";
export const precache = <
  RpcNameT extends RpcName,
  ArgsT extends ApiArgs,
  ResponseT
>(
  queryClient: QueryClient,
  rpcName: RpcNameT,
  args: ArgsT,
  data: ResponseT
) => {
  queryClient.setQueryData(getCacheKey<RpcNameT, ArgsT>(rpcName)(args), data);
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
