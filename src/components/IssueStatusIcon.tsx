import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { IssueStatus } from "../api";
import { isStatusClosed } from "../api_helpers";

export const IssueStatusIcon: React.FC<{
  issueStatus: IssueStatus | null;
  withColor?: boolean;
}> = ({ issueStatus, withColor }) =>
  isStatusClosed(issueStatus ?? null) ? (
    <GoIssueClosed style={withColor ? { color: "red" } : {}} />
  ) : (
    <GoIssueOpened style={withColor ? { color: "green" } : {}} />
  );
