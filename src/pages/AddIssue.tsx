import * as React from "react";
import { useNavigate } from "react-router-dom";
import { addIssueAccess } from "../queries/addIssue";
import { firstIssueAccess } from "../queries/issues";

export const AddIssue = () => {
  const navigate = useNavigate();
  const addIssueMutation = addIssueAccess.useRpcMutation({
    onSuccess: (data) => {
      navigate(`/issue/${data.number}`);
      // navigate(`/`);
    },
  });
  const [title, setTitle] = React.useState("");
  const [comment, setComment] = React.useState("");
  const firstIssueQuery = firstIssueAccess.useRpcQuery({
    // labelsFilter: [],
    // statusFilter: null,
  });

  const handleChangeTitle: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (event) => {
        setTitle(event.target.value);
      },
      [setTitle]
    );

  const handleChangeComment: React.ChangeEventHandler<HTMLTextAreaElement> =
    React.useCallback(
      (event) => {
        setComment(event.target.value);
      },
      [setComment]
    );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> =
    React.useCallback(
      (event) => {
        event.preventDefault();
        if (addIssueMutation.isLoading) return;
        addIssueMutation.mutate({
          comment,
          title,
        });
      },
      [addIssueMutation, comment, title]
    );

  return (
    <div className="add-issue">
      <div>
        Top Issue: {firstIssueQuery.data?.number} {firstIssueQuery.data?.title}
      </div>
      <h2>Add Issue</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          name="title"
          onChange={handleChangeTitle}
        />
        <label htmlFor="comment">Comment</label>
        <textarea
          placeholder="Comment"
          id="comment"
          name="comment"
          onChange={handleChangeComment}
        />
        <button type="submit" disabled={addIssueMutation.isLoading}>
          {addIssueMutation.isLoading ? "Adding Issue..." : "Add Issue"}
        </button>
      </form>
    </div>
  );
};
