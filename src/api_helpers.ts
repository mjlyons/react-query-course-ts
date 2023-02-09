import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  ApiArgs,
  ApiQueryKey,
  GetQueryKeyFn,
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
  MutationContext,
  ApiQueryError,
  ApiInfiniteQueryOptions,
  ApiInfiniteQueryOptionsFn,
  ApiInfiniteQueryHookPackage,
  CommonQueryHookPackageFunctions,
  QueryKeyModifier,
} from "./api";

export const useApiQuery = <QueryRpcNameT extends QueryRpcName>(
  queryKey: ApiQueryKey<QueryRpcNameT, "query">,
  queryFn: Parameters<
    typeof useQuery<
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryError<QueryRpcNameT>,
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryKey<QueryRpcNameT, "query">
    >
  >[1],
  options: Parameters<
    typeof useQuery<
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryError<QueryRpcNameT>,
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryKey<QueryRpcNameT, "query">
    >
  >[2]
): ReturnType<
  typeof useQuery<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryError<QueryRpcNameT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryKey<QueryRpcNameT, "query">
  >
> =>
  useQuery<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryError<QueryRpcNameT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryKey<QueryRpcNameT, "query">
  >(queryKey, queryFn, options);

export const useApiInfiniteQuery = <QueryRpcNameT extends QueryRpcName>(
  queryKey: ApiQueryKey<QueryRpcNameT, "infquery">,
  queryFn: Parameters<
    typeof useInfiniteQuery<
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryError<QueryRpcNameT>,
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryKey<QueryRpcNameT, "infquery">
    >
  >[1],
  options: Parameters<
    typeof useInfiniteQuery<
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryError<QueryRpcNameT>,
      ApiQueryResponse<QueryRpcNameT>,
      ApiQueryKey<QueryRpcNameT, "infquery">
    >
  >[2]
): ReturnType<
  typeof useInfiniteQuery<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryError<QueryRpcNameT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryKey<QueryRpcNameT, "infquery">
  >
> =>
  useInfiniteQuery<
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryError<QueryRpcNameT>,
    ApiQueryResponse<QueryRpcNameT>,
    ApiQueryKey<QueryRpcNameT, "infquery">
  >(queryKey, queryFn, options);

export const useApiMutation = <
  MutationRpcNameT extends MutationRpcName,
  ArgsT = MutationRpcNameToTypes[MutationRpcNameT]["args"],
  ResponseT = MutationRpcNameToTypes[MutationRpcNameT]["response"],
  ErrorT = MutationRpcNameToTypes[MutationRpcNameT]["error"],
  MutationContextT = MutationContext
>(
  mutationRpcName: MutationRpcNameT,
  mutationFn: Parameters<
    typeof useMutation<ResponseT, ErrorT, ArgsT, MutationContextT>
  >[1],
  options: Parameters<
    typeof useMutation<ResponseT, ErrorT, ArgsT, MutationContextT>
  >[2] = {}
): ReturnType<typeof useMutation<ResponseT, ErrorT, ArgsT>> =>
  useMutation<ResponseT, ErrorT, ArgsT, MutationContextT>(
    getMutationKey(mutationRpcName),
    mutationFn,
    options
  );
export const getQueryKeyFn =
  <
    QueryRpcNameT extends QueryRpcName,
    QueryKeyModifierT extends QueryKeyModifier
  >(
    queryRpcName: QueryRpcNameT,
    queryKeyModifier: QueryKeyModifierT
  ): ((
    args: ApiQueryArgs<QueryRpcNameT>
  ) => ApiQueryKey<QueryRpcNameT, QueryKeyModifierT>) =>
  (args: ApiQueryArgs<QueryRpcNameT>) => {
    return [queryRpcName, args, queryKeyModifier];
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
  statusId: Status["id"] | null | undefined
): boolean => statusId === "done" || statusId === "cancelled";
export const isStatusOpen = (statusId: Status["id"] | null): boolean =>
  !isStatusClosed(statusId);

export const STATUSES = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To-do" },
  { id: "inProgress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "cancelled", label: "Cancelled" },
] as const;
export type Status = typeof STATUSES[number];
export type StatusId = Status["id"];
const STATUS_MAP = Object.fromEntries(
  STATUSES.map((status) => [status.id, status])
);
const STATUS_IDS = STATUSES.map((status) => status.id);
export const isStatusId = (
  maybeStatusId: string
): maybeStatusId is StatusId => {
  return (STATUS_IDS as string[]).includes(maybeStatusId);
};
export const getStatusById = (statusId: StatusId) => STATUS_MAP[statusId];
export const getStatusByMaybeId = (
  maybeStatusId: string | null | undefined,
  defaultStatus: Status = getStatusById("todo")
) => {
  if (!!maybeStatusId && isStatusId(maybeStatusId)) {
    return getStatusById(maybeStatusId);
  }
  return defaultStatus;
};
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

const createCommonQueryHookPackageFunctions = <
  QueryRpcNameT extends QueryRpcName,
  QueryKeyModifierT extends QueryKeyModifier
>(
  queryRpcName: QueryRpcNameT,
  getQueryKeyFn: GetQueryKeyFn<QueryRpcNameT, QueryKeyModifierT>,
  queryFn: ApiQueryFunction<QueryRpcNameT, QueryKeyModifierT>
): CommonQueryHookPackageFunctions<QueryRpcNameT> => {
  return {
    getQueryData: (queryClient, args) => {
      return queryClient.getQueryData<ApiQueryResponse<QueryRpcNameT>>(
        getQueryKeyFn(args)
      );
    },
    setQueryData: (queryClient, args, data) => {
      queryClient.setQueryData(getQueryKeyFn(args), data);
    },
    invalidateQueries: (queryClient, args) => {
      queryClient.invalidateQueries(
        !!args ? getQueryKeyFn(args) : getQueryKeyRpcFilter(queryRpcName)
      );
    },
  };
};

type CreateApiQueryArgs<QueryRpcNameT extends QueryRpcName> = {
  queryRpcName: QueryRpcNameT;
  queryFn: ApiQueryFunction<QueryRpcNameT, "query">;
  getQueryKey?: GetQueryKeyFn<QueryRpcNameT, "query">;
  optionsFn?: ApiQueryOptionsFn<QueryRpcNameT>;
};

type CreateApiInfiniteQueryArgs<QueryRpcNameT extends QueryRpcName> = {
  queryRpcName: QueryRpcNameT;
  queryFn: ApiQueryFunction<QueryRpcNameT, "infquery">;
  getQueryKey?: GetQueryKeyFn<QueryRpcNameT, "infquery">;
  optionsFn: ApiInfiniteQueryOptionsFn<QueryRpcNameT>;
};

export const createApiQuery = <QueryRpcNameT extends QueryRpcName>({
  queryRpcName,
  queryFn,
  getQueryKey,
  optionsFn,
}: CreateApiQueryArgs<QueryRpcNameT>): ApiQueryHookPackage<QueryRpcNameT> => {
  const _getQueryKey = getQueryKey ?? getQueryKeyFn(queryRpcName, "query");
  const _optionsFn = optionsFn ?? identity;

  const useRpcQuery = (
    args: ApiQueryArgs<QueryRpcNameT>,
    options?: ApiQueryOptions<QueryRpcNameT>
  ) => {
    const optionsWithDefaults = _optionsFn(options ?? {});
    return useApiQuery<QueryRpcNameT>(
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
    ...createCommonQueryHookPackageFunctions(
      queryRpcName,
      _getQueryKey,
      queryFn
    ),
  };
};

export const createApiInfiniteQuery = <QueryRpcNameT extends QueryRpcName>({
  queryRpcName,
  queryFn,
  getQueryKey,
  optionsFn,
}: CreateApiInfiniteQueryArgs<QueryRpcNameT>): ApiInfiniteQueryHookPackage<QueryRpcNameT> => {
  const _getQueryKey = getQueryKey ?? getQueryKeyFn(queryRpcName, "infquery");
  const _optionsFn = optionsFn ?? identity;

  const useRpcInfiniteQuery = (
    args: ApiQueryArgs<QueryRpcNameT>,
    options?: ApiInfiniteQueryOptions<QueryRpcNameT>
  ) => {
    const optionsWithDefaults = _optionsFn(options ?? {});
    return useInfiniteQuery(
      _getQueryKey(args),
      queryFn(args),
      optionsWithDefaults
    );
  };

  return {
    queryRpcName,
    getQueryKey: _getQueryKey,
    queryFn,
    useRpcInfiniteQuery,
    prefetchInfinite: (queryClient, args) => {
      queryClient.prefetchInfiniteQuery(_getQueryKey(args), queryFn(args));
    },
    ...createCommonQueryHookPackageFunctions(
      queryRpcName,
      _getQueryKey,
      queryFn
    ),
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
