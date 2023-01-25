import React from "react";
import cn from "classnames";

import { Label, LabelId } from "../api";

export const LabelChip: React.FC<{
  label: Label;
  isSelected: boolean;
  onClickLabel?: (labelId: LabelId) => void;
}> = (props) => {
  const { label, isSelected, onClickLabel } = props;

  const handleClick = React.useCallback(
    () => onClickLabel?.(label.id),
    [onClickLabel]
  );

  return (
    <button
      key={label.id}
      className={cn("label", label.color, {
        selected: isSelected,
      })}
      onClick={handleClick}
    >
      {label.name}
    </button>
  );
};
