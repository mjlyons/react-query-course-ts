import React, { ChangeEventHandler, FormEventHandler } from "react";

export const SearchInput: React.FC<{
  title: string;
  onSubmit: (value: string) => void;
}> = ({ title, onSubmit }) => {
  const [value, setValue] = React.useState("");
  const handleClear = React.useCallback(() => {
    setValue("");
    onSubmit("");
  }, [setValue]);
  const handleSubmit = React.useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      onSubmit(value);
    },
    [onSubmit, value]
  );
  const handleInputChange = React.useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      setValue(event.currentTarget.value);
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit}>
      <label>{title}</label>
      <div className="search-container">
        <input value={value} onChange={handleInputChange} />
        <button type="submit">Go</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
};
