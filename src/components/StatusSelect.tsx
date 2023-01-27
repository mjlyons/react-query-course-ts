import React from "react";

import { FormEventHandler } from "react";
import { getStatusById, isStatusId, Status, STATUSES } from "../api_helpers";

export const StatusSelect: React.FC<{
  onChangeStatus: (updatedStatus: Status | null) => void;
  value: Status | null;
  noEmptyOption?: boolean;
}> = ({ onChangeStatus, value, noEmptyOption = false }) => {
  const handleChange = React.useCallback<FormEventHandler<HTMLSelectElement>>(
    (event) => {
      const option = event.currentTarget.value;
      onChangeStatus(isStatusId(option) ? getStatusById(option) : null);
    },
    [onChangeStatus]
  );

  return (
    <select
      className="status-select"
      value={value?.id ?? ""}
      onChange={handleChange}
    >
      {!noEmptyOption && <option value="">Select a status to filter</option>}
      {STATUSES.map((status) => (
        <option key={status.id} value={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  );
};
