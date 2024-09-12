import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { PaginationResponse } from "@/types/common-api-types";
import { PaginationState } from "@tanstack/react-table";
import { stringify } from "qs";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";

export type Department = {
  id: number;
  attributes: {
    name: string;
  };
};

export type DepartmentsOptions = {
  pagination: PaginationState;
};

export type DepartmentsResponse = {
  data: Department[];
  meta: {
    pagination: PaginationResponse;
  };
};

export const useDepartments = ({ pagination }: DepartmentsOptions) => {
  const apiClient = useAuthenticatedApiClient();

  const queryParams = {
    pagination: {
      pageSize: pagination.pageSize,
      page: pagination.pageIndex + 1,
    },
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["departments", pagination],
    queryFn: () =>
      apiClient.get<DepartmentsResponse>(`/departments?${queryString}`),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    retry: queriesRetryStrategy,
  });

  return query;
};
