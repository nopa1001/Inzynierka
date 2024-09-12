import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { UserResponse } from "../user/use-user";
import { PaginationState } from "@tanstack/react-table";
import { stringify } from "qs";
import { PaginationResponse } from "@/types/common-api-types";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";

export type EmployeesResponse = {
  data: UserResponse[];
  meta: {
    pagination: PaginationResponse;
  };
};

export type EmployeesOptions = {
  pagination: PaginationState;
};

export const useEmployees = ({ pagination }: EmployeesOptions) => {
  const apiClient = useAuthenticatedApiClient();

  const queryParams = {
    pagination: {
      pageSize: pagination.pageSize,
      page: pagination.pageIndex + 1,
    },
    populate: "*",
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["employees", pagination],
    queryFn: () => apiClient.get<EmployeesResponse>(`/users?${queryString}`),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    retry: queriesRetryStrategy,
  });

  return query;
};
