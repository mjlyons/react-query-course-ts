import React from "react";

export const useMultiSelect = <ValueT>(): [
  ValueT[],
  (toggledValue: ValueT) => void
] => {
  const [values, setValues] = React.useState<ValueT[]>([]);
  const handleToggle = React.useCallback<(toggledValue: ValueT) => void>(
    (toggledValue) => {
      if (values.includes(toggledValue)) {
        setValues(values.filter((value) => value !== toggledValue));
      } else {
        setValues([...values, toggledValue]);
      }
    },
    [setValues, values]
  );
  return [values, handleToggle];
};
