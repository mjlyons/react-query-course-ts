import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createApiMutation } from "../api_helpers";
import { issueAccess } from "./issue";
import { issuesAccess } from "./issues";

export const addIssueAccess = createApiMutation({
  mutationRpcName: "issue",
  mutationFn: (issueBody) =>
    fetch("/api/issues", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(issueBody),
    }).then((res) => res.json()),
  optionsFn: (options) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return {
      ...options,
      onSuccess: (data, variables, context) => {
        options.onSuccess?.(data, variables, context);
        issuesAccess.invalidateQueries(queryClient);
        issueAccess.setQueryData(
          queryClient,
          { issueNumber: data.number },
          data
        );
        navigate(`/issue/${data.number}`);
      },
    };
  },
});
