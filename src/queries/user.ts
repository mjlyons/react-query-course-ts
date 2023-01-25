import { GetUserQueryRpcName, UseApiQueryHook } from "../api";
import {
  // createUseApiQuery,
  fetchWithError,
  getQueryKeyFn,
  useApiQuery,
} from "../api_helpers";

const GET_USER_RPC_NAME: GetUserQueryRpcName = "user";
const getUserQueryKey = getQueryKeyFn(GET_USER_RPC_NAME);

export const useGetUserQuery: UseApiQueryHook<GetUserQueryRpcName> = (
  args,
  options
) =>
  useApiQuery(
    getUserQueryKey(args),
    ({ signal }) => {
      return fetchWithError(`/api/users/${args.userId}`, { signal });
    },
    {
      staleTime: 5 * 60 * 1000, // 5 min
      ...options,
    }
  );
