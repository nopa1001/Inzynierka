import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { PaginationResponse } from "@/types/common-api-types";
import { PaginationState } from "@tanstack/react-table";
import { stringify } from "qs";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";

export type Application = {
  id: number;
  attributes: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    salaryExpectations: string;
    state: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    cv: string;
  };
};

export type ApplicationsOptions = {
  pagination: PaginationState;
};

export type ApplicationsResponse = {
  data: Application[];
  meta: {
    pagination: PaginationResponse;
  };
};

export const useApplications = ({ pagination }: ApplicationsOptions) => {
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
    queryKey: ["applications", pagination],
    queryFn: () =>
      apiClient.get<ApplicationsResponse>(`/applications?${queryString}`),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    retry: queriesRetryStrategy,
  });

  return query;
};
