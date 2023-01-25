import { useQueryClient } from "@tanstack/react-query";
import {
  GetIssuesArgs,
  GetIssuesResponse,
  GetIssuesError,
  UseApiQueryHook,
  GetIssuesQueryRpcName,
} from "../api";
import { fetchWithError, getQueryKeyFn, useApiQuery } from "../api_helpers";
import { GET_ISSUE_RPC_NAME } from "./issue";

const GET_ISSUES_QUERY_RPC_NAME: GetIssuesQueryRpcName = "issues";
export const getIssuesQueryKey = getQueryKeyFn(GET_ISSUES_QUERY_RPC_NAME);

export const useGetIssuesQuery: UseApiQueryHook<
  typeof GET_ISSUES_QUERY_RPC_NAME
> = (args, options) => {
  const queryClient = useQueryClient();

  return useApiQuery(
    getIssuesQueryKey(args),
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

      return fetchWithError<GetIssuesResponse["items"]>(url.toString(), {
        // headers: { "x-error": "1" },
        signal,
      }).then((resJson) => ({
        items: resJson,
      }));
    },
    {
      ...options,
      onSuccess: (data) => {
        options.onSuccess?.(data);
        for (const issue of data.items) {
          queryClient.setQueryData(
            [GET_ISSUE_RPC_NAME, { issueNumber: issue.number }],
            issue
          );
        }
      },
    }
  );
};
