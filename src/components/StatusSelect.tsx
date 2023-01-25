import React from "react";

import { FormEventHandler } from "react";
import { IssueStatus } from "../api";
import { STATUSES } from "../api_helpers";

export const StatusSelect: React.FC<{
  onChangeStatus: (updatedStatus: IssueStatus | null) => void;
}> = (props) => {
  const { onChangeStatus } = props;
  const handleChange = React.useCallback<FormEventHandler<HTMLSelectElement>>(
    (event) => {
      const option = event.currentTarget.value;
      onChangeStatus(option === "any" ? null : (option as IssueStatus));
    },
    [onChangeStatus]
  );

  return (
    <select className="status-select" onChange={handleChange}>
      <option key="any" value="any">
        Any
      </option>
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};
