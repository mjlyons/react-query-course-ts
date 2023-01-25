export const ErrorIndicator: React.FC<{ errorMsg: string | null }> = ({
  errorMsg,
}) => <p>Error: {errorMsg}</p>;
