import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ApiArgs,
  ApiQueryKey,
  GetQueryKeyFn,
  IssueStatus,
  QueryRpcName,
  QueryRpcNameToTypes,
  MutationRpcName,
  MutationRpcNameToTypes,
  ApiQueryOptions,
  ApiQueryHookPackage,
  ApiQueryOptionsFn,
  ApiQueryFunction,
  ApiQueryArgs,
  ApiMutationOptions,
  ApiMutationFunction,
  ApiMutationOptionsFn,
  ApiMutationHookPackage,
  UseApiMutationHook,
  ApiQueryResponse,
} from "./api";

export const useApiQuery = <
  QueryRpcNameT extends QueryRpcName,
  DataT = ApiQueryResponse<QueryRpcNameT>,
  ResponseT = QueryRpcNameToTypes[QueryRpcNameT]["response"],
  ErrorT = QueryRpcNameToTypes[QueryRpcNameT]["error"]
>(
  queryKey: ApiQueryKey<QueryRpcNameT>,
  queryFn: Parameters<
    typeof useQuery<ResponseT, ErrorT, ResponseT, ApiQueryKey<QueryRpcNameT>>
  >[1],
  options: Parameters<
    typeof useQuery<ResponseT, ErrorT, DataT, ApiQueryKey<QueryRpcNameT>>
  >[2]
): ReturnType<
  typeof useQuery<ResponseT, ErrorT, DataT, ApiQueryKey<QueryRpcNameT>>
> =>
  useQuery<ResponseT, ErrorT, DataT, ApiQueryKey<QueryRpcNameT>>(
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
export const getQueryKeyFn =
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

const identity = <T>(x: T): T => x;
export const createApiQuery = <
  QueryRpcNameT extends QueryRpcName,
  DataT = ApiQueryResponse<QueryRpcNameT>
>({
  queryRpcName,
  queryFn,
  getQueryKey,
  optionsFn,
}: {
  queryRpcName: QueryRpcNameT;
  queryFn: ApiQueryFunction<QueryRpcNameT>;
  getQueryKey?: GetQueryKeyFn<QueryRpcNameT>;
  optionsFn?: ApiQueryOptionsFn<QueryRpcNameT, DataT>;
}): ApiQueryHookPackage<QueryRpcNameT, /*SelectsT ,*/ DataT> => {
  const _getQueryKey = getQueryKey ?? getQueryKeyFn(queryRpcName);
  const _optionsFn = optionsFn ?? identity;

  const useRpcQuery = (
    args: ApiQueryArgs<QueryRpcNameT>,
    options?: ApiQueryOptions<QueryRpcNameT, DataT>
  ) => {
    const optionsWithDefaults = _optionsFn(options ?? {});
    return useApiQuery<QueryRpcNameT, DataT>(
      _getQueryKey(args),
      queryFn(args),
      optionsWithDefaults
    );
  };

  return {
    queryRpcName,
    getQueryKey: _getQueryKey,
    queryFn,
    useRpcQuery,
    prefetch: (queryClient, args) => {
      queryClient.prefetchQuery(_getQueryKey(args), queryFn(args));
    },
    setQueryData: (queryClient, args, data) => {
      queryClient.setQueryData(_getQueryKey(args), data);
    },
    invalidateQueries: (queryClient, args) => {
      queryClient.invalidateQueries(
        !!args ? _getQueryKey(args) : getQueryKeyRpcFilter(queryRpcName)
      );
    },
  };
};

export const createApiMutation = <MutationRpcNameT extends MutationRpcName>({
  mutationRpcName,
  mutationFn,
  optionsFn,
}: {
  mutationRpcName: MutationRpcNameT;
  mutationFn: ApiMutationFunction<MutationRpcNameT>;
  optionsFn?: ApiMutationOptionsFn<MutationRpcNameT>;
}): ApiMutationHookPackage<MutationRpcNameT> => {
  const _optionsFn = optionsFn ?? identity;
  const useRpcMutation: UseApiMutationHook<MutationRpcNameT> = (
    options?: ApiMutationOptions<MutationRpcNameT>
  ) => {
    const optionsWithDefaults = _optionsFn(options ?? {});
    return useApiMutation(mutationRpcName, mutationFn, optionsWithDefaults);
  };
  return {
    mutationRpcName,
    mutationFn,
    useRpcMutation,
  };
};

export const reoptionApiQuery = <DataT, QueryRpcNameT extends QueryRpcName>(
  srcHookPackage: ApiQueryHookPackage<QueryRpcNameT>,
  optionsFn: ApiQueryOptionsFn<QueryRpcNameT, DataT>
): ApiQueryHookPackage<QueryRpcNameT, DataT> => {
  const { queryRpcName, queryFn, getQueryKey } = srcHookPackage;
  return createApiQuery({
    queryRpcName,
    getQueryKey,
    queryFn,
    optionsFn,
  });
};
