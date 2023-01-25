import {
  ApiQueryFunction,
  GetUserArgs,
  GetUserError,
  GetUserResponse,
  GetUserRpcName,
  UseApiQueryHook,
} from "../api";
import { createUseApiQuery, fetchWithError, useApiQuery } from "../api_helpers";

const GET_USER_RPC_NAME: GetUserRpcName = "user";

export const useGetUserQuery: UseApiQueryHook<GetUserRpcName> =
  createUseApiQuery(
    GET_USER_RPC_NAME,
    ({ queryKey: [, args], signal }) => {
      return fetchWithError(`/api/users/${args.userId}`, { signal });
    },
    { staleTime: 5 * 60 * 1000 /* 5 min */ }
  );
