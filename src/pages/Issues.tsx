import { FetchStatus } from "@tanstack/react-query";
import React from "react";

import { IssuesList } from "../components/IssuesList";
import { LabelList } from "../components/LabelList";
import { SearchInput } from "../components/SearchInput";
import { StatusSelect } from "../components/StatusSelect";
import { useMultiSelect } from "../hooks/useMultiSelect";
import { IssueStatus, LabelId } from "../api";
import { Link } from "react-router-dom";

export const Issues = () => {
  const [labelsFilter, toggleLabelFilter] = useMultiSelect<LabelId>();
  const [statusFilter, setStatusFilter] = React.useState<IssueStatus | null>(
    null
  );
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  return (
    <div>
      <main>
        <section>
          <SearchInput title={"Search Issues"} onSubmit={setSearchTerm} />

          <h2>Issues</h2>
          <IssuesList
            searchTerm={searchTerm}
            labelsFilter={labelsFilter}
            statusFilter={statusFilter}
            onClickLabel={toggleLabelFilter}
          />
        </section>
        <aside>
          <h3>Labels</h3>
          <LabelList
            labelIds={null}
            onClickLabel={toggleLabelFilter}
            selectedLabelIds={labelsFilter}
          />
          <h3>Status</h3>
          <StatusSelect onChangeStatus={setStatusFilter} />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
};