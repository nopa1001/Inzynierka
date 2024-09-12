import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";
import { UserResponse } from "@/hooks/api/user/use-user";

export const useRole = () => {
  const apiClient = useAuthenticatedApiClient();

  const query = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => apiClient.get<UserResponse>("/users/me?populate=*"),
    select: (response) => response.data.role,
    retry: queriesRetryStrategy,
  });

  return query;
};
