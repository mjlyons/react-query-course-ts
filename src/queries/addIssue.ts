import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  AddIssueArgs,
  AddIssueError,
  AddIssueResponse,
  GetIssueResponse,
  GetIssuesResponse,
} from "../api";
import {
  getCacheKey,
  getCacheKeyRpcFilter,
  GET_ISSUES_RPC_NAME,
} from "../api_helpers";
import { GET_ISSUE_RPC_NAME } from "./issue";

export const useAddIssueMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<AddIssueResponse, AddIssueError, AddIssueArgs>(
    (issueBody) => {
      return fetch("/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json());
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(getCacheKeyRpcFilter("issues"));
        queryClient.setQueryData<GetIssueResponse>(
          getCacheKey(GET_ISSUE_RPC_NAME)({ issueNumber: data.number }),
          data
        );
        navigate(`/issue/${data.number}`);
        //navigate(`/`);
      },
    }
  );
};
