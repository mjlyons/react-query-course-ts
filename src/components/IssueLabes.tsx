import React from "react";
import { GoGear } from "react-icons/go";
import { IssueNumber, LabelId } from "../api";
import { labelsAccess } from "../queries/labels";
import cn from "classnames";
import { updateIssueAccess } from "../queries/updateIssue";

export const IssueLabels: React.FC<{
  issueLabelIds: LabelId[];
  issueNumber: IssueNumber;
}> = ({ issueLabelIds, issueNumber }) => {
  const labelsQuery = labelsAccess.useRpcQuery({});
  const updateIssueMutation = updateIssueAccess.useRpcMutation();
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  return (
    <div className="issue-options">
      <div>
        <span>Labels</span>
        {!labelsQuery.isLoading &&
          issueLabelIds.map((issueLabelId) => {
            const label = (labelsQuery.data ?? []).find(
              (iterLabel) => issueLabelId === iterLabel.id
            );
            if (!label) return;
            return (
              <span key={label.id} className={`label ${label.color}`}>
                {label.name}
              </span>
            );
          })}
      </div>
      <GoGear
        onClick={() => !labelsQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className="picker-menu labels">
          {(labelsQuery.data ?? []).map((label) => {
            if (!label.id) return;
            const toggledLabelId = label.id;

            const selected = issueLabelIds.includes(toggledLabelId);
            return (
              <div
                key={label.id}
                className={cn({ selected })}
                onClick={() => {
                  const updatedLabelIds = selected
                    ? issueLabelIds.filter(
                        (issueLabelId) => issueLabelId !== toggledLabelId
                      )
                    : [...issueLabelIds, toggledLabelId];
                  updateIssueMutation.mutate({
                    issueNumber,
                    labels: updatedLabelIds,
                  });
                }}
              >
                <span
                  className="label-dot"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </div>
            );
          })}{" "}
        </div>
      )}
    </div>
  );
};
