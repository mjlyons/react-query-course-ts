import { useQuery } from "@tanstack/react-query";

import {
  GetLabelsArgs,
  GetLabelsError,
  GetLabelsResponse,
  GetLabelsQueryRpcName,
  UseApiQueryHook,
} from "../api";
import { fetchWithError, getQueryKeyFn, useApiQuery } from "../api_helpers";
import { defaultLabels } from "../helpers/defaultData";

export const GET_LABELS_QUERY_RPC_NAME: GetLabelsQueryRpcName = "labels";
const getLabelsQueryKey = getQueryKeyFn(GET_LABELS_QUERY_RPC_NAME);

export const useGetLabelsQuery: UseApiQueryHook<GetLabelsQueryRpcName> = (
  args,
  options
) =>
  useApiQuery(
    getLabelsQueryKey(args),
    ({ signal }) => fetchWithError("/api/labels", { signal }),
    {
      staleTime: 60 * 60 * 1000 /* 1 hr */,
      placeholderData: defaultLabels,
      ...options,
    }
  );
