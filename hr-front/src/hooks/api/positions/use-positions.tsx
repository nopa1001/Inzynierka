import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "@/types/common-api-types";
import { stringify } from "qs";
import { PaginationState } from "@tanstack/react-table";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type Position = {
  id: number;
  attributes: {
    name: string;
  };
};

export type GetPositionsOptions = {
  pagination: PaginationState;
};

export type GetPositionsResponse = {
  data: Position[];
  meta: {
    pagination: PaginationResponse;
  };
};

export const usePositions = ({ pagination }: GetPositionsOptions) => {
  const apiClient = useAuthenticatedApiClient();

  const queryParams = {
    pagination: {
      pageSize: pagination.pageSize,
      page: pagination.pageIndex + 1,
    },
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["positions", pagination],
    queryFn: () =>
      apiClient.get<GetPositionsResponse>(`/positions?${queryString}`),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    retry: queriesRetryStrategy,
  });

  return query;
};
