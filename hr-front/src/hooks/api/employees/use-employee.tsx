import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { UserResponse } from "../user/use-user";
import { stringify } from "qs";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";

export type EmployeeResponse = UserResponse;

export type EmployeeOptions = {
  id?: string;
};

export const useEmployee = ({ id }: EmployeeOptions) => {
  const apiClient = useAuthenticatedApiClient();

  const queryParams = {
    populate: "*",
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["employee", id],
    queryFn: () =>
      apiClient.get<EmployeeResponse>(`/users/${id}?${queryString}`),
    select: (response) => response.data,
    retry: queriesRetryStrategy,
    enabled: !!id,
  });

  return query;
};
