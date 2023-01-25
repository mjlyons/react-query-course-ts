import { UserId } from "../api";
import { useGetUserQuery } from "../queries/user";
import { ErrorIndicator } from "./ErrorIndicator";

export const UserAvatar: React.FC<{ userId: UserId }> = ({ userId }) => {
  const userQuery = useGetUserQuery({ userId }, {});

  if (userQuery.isLoading) return <>{userId}</>;
  if (userQuery.isError) return <ErrorIndicator errorMsg={userQuery.error} />;
  if (!userQuery.data)
    return <ErrorIndicator errorMsg={`${userId} data missing`} />;

  const user = userQuery.data;

  return (
    <img
      className="avatar"
      src={user.profilePictureUrl}
      alt={user.name}
      title={user.name}
    />
  );
};
