import { useQueryClient } from "@tanstack/react-query";
import { GetIssueArgs, LabelId, UpdateIssueArgs } from "../api";
import { createApiMutation, fetchWithError } from "../api_helpers";
import { issueAccess } from "./issue";
import { issuesAccess } from "./issues";

export const updateIssueAccess = createApiMutation({
  mutationRpcName: "issue/update",
  mutationFn: ({ issueNumber, status, assignee, labels }) => {
    const bodyJson: Omit<UpdateIssueArgs, "issueNumber"> = {};
    if (status !== undefined) {
      bodyJson.status = status;
    }
    if (assignee !== undefined) {
      bodyJson.assignee = assignee;
    }
    if (labels !== undefined) {
      bodyJson.labels = labels;
    }

    return fetchWithError(`/api/issues/${issueNumber}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(bodyJson),
    });
  },
  optionsFn: (options) => {
    const queryClient = useQueryClient();
    return {
      ...options,
      onMutate: ({ issueNumber, status, assignee, labels }) => {
        const getIssueArgs: GetIssueArgs = { issueNumber };
        const origIssue = issueAccess.getQueryData(queryClient, getIssueArgs);

        const updates: Omit<UpdateIssueArgs, "issueNumber"> = {};
        const rollbacks: Omit<UpdateIssueArgs, "issueNumber" | "labels"> = {};
        const labelRollbacks: {
          addedLabelIds?: LabelId[];
          removedLabelIds?: LabelId[];
        } = {};

        if (status !== undefined) {
          updates.status = status;
          rollbacks.status = origIssue.status;
        }
        if (assignee !== undefined) {
          updates.assignee = assignee;
          rollbacks.assignee = origIssue.assignee;
        }
        if (labels !== undefined) {
          updates.labels = labels;
          labelRollbacks.addedLabelIds = labels.filter((label) =>
            origIssue.labels?.includes(label)
          );
          labelRollbacks.removedLabelIds = origIssue.labels?.filter((label) =>
            labels.includes(label)
          );
        }

        const updatedIssue = { ...origIssue, ...updates };
        issueAccess.setQueryData(queryClient, getIssueArgs, updatedIssue);

        return {
          rollback: () => {
            const needsRollbackIssue = issueAccess.getQueryData(
              queryClient,
              getIssueArgs
            );

            // Remove added labels, and add back removed labels
            const rollbackLabelIds: LabelId[] = [
              ...(needsRollbackIssue.labels ?? []),
              ...(labelRollbacks.removedLabelIds ?? []),
            ].filter(
              (needsRollbackLabelId) =>
                !labelRollbacks.addedLabelIds?.includes(needsRollbackLabelId)
            );

            issueAccess.setQueryData(queryClient, getIssueArgs, {
              ...needsRollbackIssue,
              ...rollbacks,
              labels: rollbackLabelIds,
            });
          },
        };
      },
      onError: (error, variables, ctx) => {
        ctx?.rollback?.();
      },
      onSuccess: (data, { issueNumber }) => {
        // if it worked, assume optimisitc update (and subsequent ones) are working correctly
        // ---
        // const getIssueArgs: GetIssueArgs = { issueNumber };
        // const origIssue = issueAccess.getQueryData(queryClient, getIssueArgs);
        // const updatedIssue = { ...origIssue, status: data.status };
        // issueAccess.setQueryData(queryClient, getIssueArgs, updatedIssue);
      },
      onSettled: (data, error, { issueNumber }) => {
        //issueAccess.invalidateQueries(queryClient, { issueNumber });
        issuesAccess.invalidateQueries(queryClient);
      },
    };
  },
});
