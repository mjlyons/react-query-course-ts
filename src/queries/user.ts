import { GetUserQueryRpcName, UseApiQueryHook } from "../api";
import {
  // createUseApiQuery,
  fetchWithError,
  useApiQuery,
} from "../api_helpers";

const GET_USER_RPC_NAME: GetUserQueryRpcName = "user";

export const useGetUserQuery: UseApiQueryHook<GetUserQueryRpcName> =
  // createUseApiQuery(
  (args, options) =>
    useApiQuery(
      GET_USER_RPC_NAME,
      args,
      ({ signal }) => {
        return fetchWithError(`/api/users/${args.userId}`, { signal });
      },
      {
        staleTime: 5 * 60 * 1000, // 5 min
        ...options,
      }
    );
