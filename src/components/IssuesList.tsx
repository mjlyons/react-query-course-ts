import * as React from "react";
import { useGetIssuesQuery } from "../queries/issues";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { getIssueRoute } from "../App";
import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { isStatusClosed } from "../api_helpers";
import { Issue, IssueStatus, LabelId } from "../api";
import { LoadingIndicator } from "./LoadingIndicator";
import { LabelList } from "./LabelList";
import { UserAvatar } from "./UserAvatar";
import { UserName } from "./UserName";
import { IssueStatusIcon } from "./IssueStatusIcon";
import { useSearchIssuesQuery } from "../queries/searchIssues";
import { prefetchGetIssueQuery } from "../queries/issue";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchGetIssueCommentsQuery } from "../queries/issueComments";

export const IssuesList: React.FC<{
  searchTerm?: string | null;
  labelsFilter?: LabelId[];
  statusFilter?: IssueStatus | null;
  onClickLabel: (labelId: LabelId) => void;
}> = (props) => {
  const { searchTerm, labelsFilter, statusFilter, onClickLabel } = props;

  const issuesQuery = !!searchTerm
    ? useSearchIssuesQuery({ searchTerm }, {})
    : useGetIssuesQuery({ labelsFilter, statusFilter }, {});

  if (issuesQuery.isLoading) {
    return <LoadingIndicator />;
  }
  if (issuesQuery.isError) {
    return <p>Error: {issuesQuery.error.message}</p>;
  }
  if (!issuesQuery.data) {
    return <p>Error: unable to retreive issues list</p>;
  }

  return (
    <>
      {issuesQuery.isFetching && <LoadingIndicator />}
      {issuesQuery.data.items.map((issue) => (
        <ul key={issue.id} className="issues-list">
          <IssueItem key={issue.id} issue={issue} onClickLabel={onClickLabel} />
        </ul>
      ))}
    </>
  );
};

const IssueItem: React.FC<{
  issue: Issue;
  onClickLabel: (labelId: LabelId) => void;
}> = (props) => {
  const { issue, onClickLabel } = props;
  const queryClient = useQueryClient();

  const handleMouseEnter = React.useCallback(() => {
    prefetchGetIssueQuery(queryClient, { issueNumber: issue.number });
    prefetchGetIssueCommentsQuery(queryClient, { issueNumber: issue.number });
  }, [queryClient, issue.number]);

  const commentCount = issue.comments?.length || 0;

  return (
    <li onMouseEnter={handleMouseEnter}>
      <div>
        <IssueStatusIcon withColor issueStatus={issue.status ?? null} />
      </div>
      <div className="issue-content">
        <span>
          <Link to={getIssueRoute(issue.number)}>{issue.title}</Link>
          <LabelList
            labelIds={issue.labels ?? []}
            onClickLabel={onClickLabel}
          />
        </span>
        <small>
          #{issue.number} opened {relativeDate(issue.createdDate)} by{" "}
          <UserName userId={issue.createdBy} />
        </small>
        <div>Status: {issue.status}</div>
      </div>
      {!!issue.assignee ? (
        <div className="assigned-to">
          <UserAvatar userId={issue.assignee} />
        </div>
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
};
