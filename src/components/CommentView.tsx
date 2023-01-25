import React from "react";
import { relativeDate } from "../helpers/relativeDate";
import { Comment } from "../api";
import { LoadingIndicator } from "./LoadingIndicator";
import { userAccess } from "../queries/user";

const CommentContainer: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => <div className="comment">{children}</div>;
const CommentHeader: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="comment-header">{children}</div>
);
const CommentBody: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="comment-body">{children}</div>
);

const CommenterLoading: React.FC<{}> = () => (
  <CommentContainer>
    <CommentHeader>
      <LoadingIndicator />
    </CommentHeader>
  </CommentContainer>
);

export const CommentView: React.FC<{ comment: Comment }> = ({ comment }) => {
  const userQuery = !!comment.createdBy
    ? userAccess.useRpcQuery({ userId: comment.createdBy }, {})
    : null;

  if (userQuery?.isLoading) return <CommenterLoading />;

  return (
    <CommentContainer>
      <img src={userQuery?.data?.profilePictureUrl} alt="Commenter avatar" />
      <div>
        <CommentHeader>
          <span>{userQuery?.data?.name}</span> commented{" "}
          <span>{relativeDate(comment.createdDate)}</span>
        </CommentHeader>
        <CommentBody>{comment.comment}</CommentBody>
      </div>
    </CommentContainer>
  );
};
