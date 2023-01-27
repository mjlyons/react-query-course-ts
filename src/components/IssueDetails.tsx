import { useParams } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { Issue } from "../api";
import {
  getStatusById,
  getStatusByMaybeId,
  isStatusClosed,
  isStatusId,
  isStatusOpen,
} from "../api_helpers";
import { CommentView } from "./CommentView";
import { ErrorIndicator } from "./ErrorIndicator";
import { IssueStatusIcon } from "./IssueStatusIcon";
import { LoadingIndicator } from "./LoadingIndicator";
import { UserName } from "./UserName";
import { issueAccess } from "../queries/issue";
import { issueCommentsAccess } from "../queries/issueComments";
import { IssueStatus } from "./issueStatus";

export const IssueDetails: React.FC<{ issueNumber: number }> = ({
  issueNumber,
}) => {
  const issueQuery = issueAccess.useRpcQuery({ issueNumber }, {});
  const commentsQuery = issueCommentsAccess.useRpcQuery({ issueNumber }, {});

  if (issueQuery.isLoading) return <LoadingIndicator />;
  if (issueQuery.isError)
    return <ErrorIndicator errorMsg={issueQuery.error.message} />;
  if (!issueQuery.data)
    return <ErrorIndicator errorMsg="Issue data is unavailable" />;

  return (
    <div className="issue-details">
      <h1>Issue {issueNumber}</h1>
      <IssueHeader issue={issueQuery.data} />
      <main>
        <section>
          {commentsQuery.data?.map((comment) => (
            <CommentView key={comment.id} comment={comment} />
          ))}
        </section>
        <aside>
          <IssueStatus
            status={getStatusByMaybeId(issueQuery.data.status)}
            issueNumber={issueQuery.data.number}
          />
        </aside>
      </main>
    </div>
  );
};

const IssueHeader: React.FC<{ issue: Issue }> = ({ issue }) => {
  return (
    <header>
      <h2>
        {issue.title} <span>#{issue.number}</span>
        <div>
          <span
            className={
              !issue.status ||
              !isStatusId(issue.status) ||
              isStatusOpen(issue.status)
                ? "open"
                : "closed"
            }
          >
            <IssueStatusIcon issueStatus={issue.status ?? null} />
            {issue.status}
          </span>
          <span className="created-by">
            <UserName userId={issue.createdBy} />
          </span>{" "}
          opened this issue {relativeDate(issue.createdDate)} -{" "}
          {(issue.comments ?? []).length} comments
        </div>
      </h2>
    </header>
  );
};
