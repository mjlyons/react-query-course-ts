import { useQueryClient } from "@tanstack/react-query";
import { createApiMutation } from "../api_helpers";
import { issueAccess } from "./issue";
import { issuesAccess } from "./issues";

export const addIssueAccess = createApiMutation({
  mutationRpcName: "issue/add",
  mutationFn: (issueBody) =>
    fetch("/api/issues", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(issueBody),
    }).then((res) => res.json()),
  optionsFn: (options) => {
    const queryClient = useQueryClient();
    return {
      ...options,
      onSuccess: (data, variables, context) => {
        issuesAccess.invalidateQueries(queryClient);
        issueAccess.setQueryData(
          queryClient,
          { issueNumber: data.number },
          data
        );
        options.onSuccess?.(data, variables, context);
      },
    };
  },
});
