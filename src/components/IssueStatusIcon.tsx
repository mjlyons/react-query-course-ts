import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { isStatusClosed, Status } from "../api_helpers";

export const IssueStatusIcon: React.FC<{
  issueStatus: Status["id"] | null;
  withColor?: boolean;
}> = ({ issueStatus, withColor }) =>
  isStatusClosed(issueStatus ?? null) ? (
    <GoIssueClosed style={withColor ? { color: "red" } : {}} />
  ) : (
    <GoIssueOpened style={withColor ? { color: "green" } : {}} />
  );
