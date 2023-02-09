import { useQueryClient } from "@tanstack/react-query";
import { GetIssuesResponse, Issue, UseApiQueryHook } from "../api";
import { createApiQuery, fetchWithError, getQueryKeyFn } from "../api_helpers";
import { issueAccess } from "./issue";

export const issuesAccess = createApiQuery({
  queryRpcName: "issues",
  getQueryKey: (_args) => {
    const args: typeof _args = {
      ..._args,
      labelsFilter: _args.labelsFilter ?? [],
      statusFilter: _args.statusFilter ?? null,
    };
    return getQueryKeyFn("issues", "query")(args);
  },
  queryFn:
    (args) =>
    ({ signal }) => {
      const url = new URL("/api/issues", window.location.origin);
      for (const label of args.labelsFilter ?? []) {
        // There seems to be a bug where the id "help wanted" is returned by the server as "help"
        const labelFilter = label == "help" ? "help wanted" : label;
        url.searchParams.append("labels[]", labelFilter);
      }
      if (!!args.statusFilter) {
        url.searchParams.append("status", args.statusFilter);
      }
      if (args.pageNum !== undefined) {
        url.searchParams.append("page", args.pageNum.toString());
      }

      return fetchWithError<GetIssuesResponse["items"]>(url.toString(), {
        // headers: { "x-error": "1" },
        signal,
      }).then((resJson) => ({
        items: resJson,
      }));
    },
  optionsFn: (options) => {
    const queryClient = useQueryClient();
    return {
      ...options,
      onSuccess: (data) => {
        options.onSuccess?.(data);
        for (const issue of data.items) {
          issueAccess.setQueryData(
            queryClient,
            { issueNumber: issue.number },
            issue
          );
        }
      },
    };
  },
});
