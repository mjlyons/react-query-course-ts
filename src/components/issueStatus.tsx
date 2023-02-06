import * as React from "react";
import { IssueNumber } from "../api";
import { Status } from "../api_helpers";
import { updateIssueAccess } from "../queries/updateIssue";
import { StatusSelect } from "./StatusSelect";

export const IssueStatus: React.FC<{
  status: Status;
  issueNumber: IssueNumber;
}> = ({ status, issueNumber }) => {
  const updateIssueMutation = updateIssueAccess.useRpcMutation();

  return (
    <div className="issue-options">
      <div>
        <span>Status</span>
        <StatusSelect
          noEmptyOption
          value={status}
          onChangeStatus={(status) => {
            if (!!status) {
              updateIssueMutation.mutate({ status: status.id, issueNumber });
            }
          }}
        />
      </div>
    </div>
  );
};
