import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AddIssueMutationRpcName, UseApiMutationHook } from "../api";
import { useApiMutation } from "../api_helpers";
import { issueAccess } from "./issue";
import { issuesAccess } from "./issues";

export const ADD_ISSUE_MUTATION_RPC_NAME: AddIssueMutationRpcName = "issue";

export const useAddIssueMutation: UseApiMutationHook<
  AddIssueMutationRpcName
> = (options = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useApiMutation<AddIssueMutationRpcName>(
    ADD_ISSUE_MUTATION_RPC_NAME,
    (issueBody) => {
      return fetch("/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json());
    },
    {
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
    }
  );
};
