import React from "react";
import { GoGear } from "react-icons/go";
import { IssueNumber, UserId } from "../api";
import { updateIssueAccess } from "../queries/updateIssue";
import { userAccess } from "../queries/user";
import { usersAccess } from "../queries/users";

export const IssueAssignment: React.FC<{
  assignee: UserId | null;
  issueNumber: IssueNumber;
}> = ({ assignee: assignee, issueNumber }) => {
  const assignedUserQuery = userAccess.useRpcQuery(
    { userId: assignee ?? "NoUser" },
    { enabled: !!assignee }
  );
  const usersQuery = usersAccess.useRpcQuery({});
  const updateIssueMutation = updateIssueAccess.useRpcMutation();
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {assignedUserQuery.isSuccess && (
          <div>
            <img src={assignedUserQuery.data?.profilePictureUrl} />
            {assignedUserQuery.data?.name}
          </div>
        )}
      </div>
      <GoGear
        onClick={() => !usersQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className="picker-menu">
          {usersQuery.data?.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                updateIssueMutation.mutate({
                  issueNumber,
                  assignee: user.id,
                });
                setMenuOpen(false);
              }}
            >
              <img src={user.profilePictureUrl} />
              {user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
