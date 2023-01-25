import { Label, LabelId } from "../api";
import { isValid } from "../api_helpers";
import { useGetLabelsQuery } from "../queries/labels";
import { ErrorIndicator } from "./ErrorIndicator";
import { LabelChip } from "./Label";
import { LoadingIndicator } from "./LoadingIndicator";

type LabelListProps = {
  labelIds: LabelId[] | null;
  onClickLabel?: (labelId: LabelId) => void;
  selectedLabelIds?: LabelId[] | null;
};

export const LabelList: React.FC<LabelListProps> = (props) => {
  const labelsQuery = useGetLabelsQuery({}, {});

  if (labelsQuery.isLoading) {
    return <LoadingIndicator />;
  }
  if (labelsQuery.isError) {
    return <ErrorIndicator errorMsg={labelsQuery.error.message} />;
  }
  if (!labelsQuery.data) {
    return <ErrorIndicator errorMsg={"Labels data is missing"} />;
  }

  return <Labels {...props} allLabels={labelsQuery.data} />;
};

const Labels: React.FC<{ allLabels: Label[] } & LabelListProps> = (props) => {
  const { onClickLabel, selectedLabelIds } = props;

  const labels = !!props.labelIds
    ? props.labelIds
        .map((labelId) =>
          props.allLabels.find((allLabel) => labelId === allLabel.id)
        )
        .filter(isValid)
    : props.allLabels;
  return (
    <div className="labels">
      {labels.map((label) => (
        <LabelChip
          key={label.id}
          isSelected={(selectedLabelIds ?? []).includes(label.id)}
          label={label}
          onClickLabel={onClickLabel}
        />
      ))}
    </div>
  );
};
