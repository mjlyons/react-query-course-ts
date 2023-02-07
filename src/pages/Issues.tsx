import { FetchStatus } from "@tanstack/react-query";
import React from "react";

import { IssuesList } from "../components/IssuesList";
import { LabelList } from "../components/LabelList";
import { SearchInput } from "../components/SearchInput";
import { StatusSelect } from "../components/StatusSelect";
import { useMultiSelect } from "../hooks/useMultiSelect";
import { Link } from "react-router-dom";
import { Status } from "../api_helpers";
import { LabelId } from "../api";

export const Issues = () => {
  const [labelsFilter, toggleLabelFilter] = useMultiSelect<LabelId>();
  const [statusFilter, setStatusFilter] = React.useState<Status | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [pageNum, setPageNum] = React.useState<number>(1);

  return (
    <div>
      <main>
        <section>
          <SearchInput
            title={"Search Issues"}
            onSubmit={(value) => {
              setSearchTerm(value);
              setPageNum(1);
            }}
          />

          <h2>Issues</h2>
          <IssuesList
            searchTerm={searchTerm}
            labelsFilter={labelsFilter}
            statusFilter={statusFilter}
            onClickLabel={toggleLabelFilter}
            pageNum={pageNum}
            setPageNum={setPageNum}
          />
        </section>
        <aside>
          <h3>Labels</h3>
          <LabelList
            labelIds={null}
            onClickLabel={(labelId) => {
              toggleLabelFilter(labelId);
              setPageNum(1);
            }}
            selectedLabelIds={labelsFilter}
          />
          <h3>Status</h3>
          <StatusSelect
            onChangeStatus={(updatedStatus) => {
              setStatusFilter(updatedStatus);
              setPageNum(1);
            }}
            value={statusFilter}
          />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
};
