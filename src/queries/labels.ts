import { useQuery } from "@tanstack/react-query";

import {
  GetLabelsArgs,
  GetLabelsError,
  GetLabelsResponse,
  GetLabelsRpcName,
  UseApiQueryHook,
} from "../api";
import { createUseApiQuery, fetchWithError, useApiQuery } from "../api_helpers";
import { defaultLabels } from "../helpers/defaultData";

export const GET_LABELS_CACHE_KEY: GetLabelsRpcName = "labels";

export const useGetLabelsQuery: UseApiQueryHook<GetLabelsRpcName> =
  createUseApiQuery(
    GET_LABELS_CACHE_KEY,
    ({ signal }) => fetchWithError("/api/labels", { signal }),
    {
      staleTime: 60 * 60 * 1000 /* 1 hr */,
      placeholderData: defaultLabels,
    }
  );
