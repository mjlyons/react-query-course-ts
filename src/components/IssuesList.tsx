import * as React from "react";
import { issuesAccess } from "../queries/issues";
import { GoComment } from "react-icons/go";
import { getIssueRoute } from "../App";
import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { Issue, LabelId } from "../api";
import { LoadingIndicator } from "./LoadingIndicator";
import { LabelList } from "./LabelList";
import { UserAvatar } from "./UserAvatar";
import { UserName } from "./UserName";
import { IssueStatusIcon } from "./IssueStatusIcon";
import { useQueryClient } from "@tanstack/react-query";
import { searchIssuesAccess } from "../queries/searchIssues";
import { issueAccess } from "../queries/issue";
import { issueCommentsInfAccess } from "../queries/issueComments";
import { Status } from "../api_helpers";

export const IssuesList: React.FC<{
  searchTerm?: string | null;
  labelsFilter?: LabelId[];
  statusFilter?: Status | null;
  onClickLabel: (labelId: LabelId) => void;
  pageNum: number;
  setPageNum: (updatedPageNum: number) => void;
}> = (props) => {
  const { searchTerm, labelsFilter, statusFilter, onClickLabel } = props;
  const isSearching = !!searchTerm;
  const searchQuery = searchIssuesAccess.useRpcQuery(
    { searchTerm: searchTerm ?? "" },
    { enabled: isSearching }
  );
  const listQuery = issuesAccess.useRpcQuery(
    {
      labelsFilter,
      statusFilter: statusFilter?.id,
      pageNum: props.pageNum ?? 1,
    },
    { enabled: !isSearching, keepPreviousData: true }
  );
  const issuesQuery = isSearching ? searchQuery : listQuery;

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
      {!isSearching && (
        <div className="pagination">
          <button
            disabled={props.pageNum <= 1}
            onClick={() => {
              props.setPageNum(Math.max(0, props.pageNum - 1));
            }}
          >
            Previous
          </button>
          <p>
            Page {props.pageNum} {issuesQuery.isFetching && "..."}
          </p>
          <button
            disabled={
              issuesQuery.data.items.length <= 0 || issuesQuery.isPreviousData
            }
            onClick={() => {
              if (
                issuesQuery.data.items.length > 0 &&
                !issuesQuery.isPreviousData
              ) {
                props.setPageNum(props.pageNum + 1);
              }
            }}
          >
            Next
          </button>
        </div>
      )}
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
    issueAccess.prefetch(queryClient, { issueNumber: issue.number });
    issueCommentsInfAccess.prefetchInfinite(queryClient, {
      issueNumber: issue.number,
    });
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
          {!!issue.createdBy && (
            <>
              by <UserName userId={issue.createdBy} />
            </>
          )}
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
