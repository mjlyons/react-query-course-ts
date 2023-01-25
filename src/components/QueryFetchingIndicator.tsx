import React from "react";
import { useIsFetching } from "@tanstack/react-query";
import { LoadingIndicator } from "./LoadingIndicator";

export const QueryFetchingIndicator: React.FC<{}> = () => {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div className="fetching-indicator">
      <LoadingIndicator />
    </div>
  ) : null;
};
