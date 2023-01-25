import { useQuery } from "@tanstack/react-query";

import {
  GetLabelsArgs,
  GetLabelsError,
  GetLabelsResponse,
  GetLabelsQueryRpcName,
  UseApiQueryHook,
} from "../api";
import {
  // createUseApiQuery,
  fetchWithError,
  useApiQuery,
} from "../api_helpers";
import { defaultLabels } from "../helpers/defaultData";

export const GET_LABELS_CACHE_KEY: GetLabelsQueryRpcName = "labels";

export const useGetLabelsQuery: UseApiQueryHook<GetLabelsQueryRpcName> = (
  args,
  options
) => {
  // createUseApiQuery(
  return useApiQuery(
    GET_LABELS_CACHE_KEY,
    args,
    ({ signal }) => fetchWithError("/api/labels", { signal }),
    {
      staleTime: 60 * 60 * 1000 /* 1 hr */,
      placeholderData: defaultLabels,
      ...options,
    }
  );
};
