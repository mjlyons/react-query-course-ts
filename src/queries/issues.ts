import {
  GetIssuesArgs,
  GetIssuesResponse,
  GetIssuesError,
  UseApiQueryHook,
} from "../api";
import {
  createUseApiQuery,
  fetchWithError,
  GET_ISSUES_RPC_NAME,
} from "../api_helpers";
import { precacheGetIssueQuery } from "./issue";

export const useGetIssuesQuery: UseApiQueryHook<typeof GET_ISSUES_RPC_NAME> =
  createUseApiQuery(
    GET_ISSUES_RPC_NAME,
    // ({ queryClient }) =>
    ({ queryKey: [, args], signal }) => {
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
    {},
    {
      normalizer: (data, queryClient) => {
        for (const issue of data.items) {
          precacheGetIssueQuery(
            queryClient,
            { issueNumber: issue.number },
            issue
          );
        }
      },
    }
  );