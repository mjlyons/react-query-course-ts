import { createApiQuery, fetchWithError } from "../api_helpers";
import { defaultLabels } from "../helpers/defaultData";

export const labelsAccess = createApiQuery({
  queryRpcName: "labels",
  queryFn:
    (args) =>
    ({ signal }) =>
      fetchWithError("/api/labels", { signal }),
  optionsFn: (options) => ({
    staleTime: 60 * 60 * 1000 /* 1 hr */,
    placeholderData: defaultLabels,
    ...options,
  }),
});
