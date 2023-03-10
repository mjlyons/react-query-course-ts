import { useParams } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { Issue } from "../api";
import { getStatusByMaybeId, isStatusId, isStatusOpen } from "../api_helpers";
import { CommentView } from "./CommentView";
import { ErrorIndicator } from "./ErrorIndicator";
import { IssueStatusIcon } from "./IssueStatusIcon";
import { LoadingIndicator } from "./LoadingIndicator";
import { UserName } from "./UserName";
import { issueAccess } from "../queries/issue";
import { issueCommentsInfAccess } from "../queries/issueComments";
import { IssueStatus } from "./issueStatus";
import { IssueAssignment } from "./IssueAssignment";
import { IssueLabels } from "./IssueLabes";
import { useScrollToBottomAction } from "../helpers/useScrollToBottomAction";

export const IssueDetails: React.FC<{ issueNumber: number }> = ({
  issueNumber,
}) => {
  const issueQuery = issueAccess.useRpcQuery({ issueNumber });
  const commentsQuery = issueCommentsInfAccess.useRpcInfiniteQuery({
    issueNumber,
  });

  useScrollToBottomAction(
    { document },
    commentsQuery.fetchNextPage,
    50 /* offset px */
  );

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
        <section
          onScroll={(event) => {
            console.log(event);
          }}
        >
          {commentsQuery.data?.pages.map((page) =>
            page.map((comment) => (
              <CommentView key={comment.id} comment={comment} />
            ))
          )}
          {commentsQuery.isFetchingNextPage && <LoadingIndicator />}
        </section>
        <aside>
          <IssueStatus
            status={getStatusByMaybeId(issueQuery.data.status)}
            issueNumber={issueQuery.data.number}
          />
          <IssueAssignment
            assignee={issueQuery.data.assignee ?? null}
            issueNumber={issueQuery.data.number}
          />
          <IssueLabels
            issueLabelIds={issueQuery.data.labels ?? []}
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
            {!!issue.createdBy && <UserName userId={issue.createdBy} />}
          </span>{" "}
          opened this issue {relativeDate(issue.createdDate)} -{" "}
          {(issue.comments ?? []).length} comments
        </div>
      </h2>
    </header>
  );
};
