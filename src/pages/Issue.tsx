import { useParams } from "react-router-dom";
import { IssueDetails } from "../components/IssueDetails";

export const Issue: React.FC<{}> = () => {
  const issueNumber = parseInt(useParams().number ?? "");
  if (Number.isNaN(issueNumber)) {
    return <></>;
  }
  return <IssueDetails issueNumber={issueNumber} />;
};
