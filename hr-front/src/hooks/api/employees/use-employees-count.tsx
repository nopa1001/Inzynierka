import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";

export const useEmployeesCount = () => {
  const apiClient = useAuthenticatedApiClient();

  const query = useQuery({
    queryKey: ["employees-count"],
    queryFn: () => apiClient.get<number>("/users/count"),
    select: (response) => response.data,
    retry: queriesRetryStrategy,
  });

  return query;
};
