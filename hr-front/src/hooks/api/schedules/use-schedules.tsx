import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { PaginationResponse } from "@/types/common-api-types";
import { PaginationState } from "@tanstack/react-table";
import { stringify } from "qs";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";
import { UserResponse } from "@/hooks/api/user/use-user";

export type Schedule = {
  id: number;
  attributes: {
    date_from: string;
    date_to: string;
    type: "WORK";
    user: {
      data: {
        id: string;
        attributes: UserResponse;
      };
    };
  };
};

export type GetSchedulesOptions = {
  pagination: PaginationState;
  userId?: number | string;
  date_from?: Date;
  date_to?: Date;
};

export type GetSchedulesResponse = {
  data: Schedule[];
  meta: {
    pagination: PaginationResponse;
  };
};

export const useSchedules = ({
  pagination,
  userId,
  date_from,
  date_to,
}: GetSchedulesOptions) => {
  const apiClient = useAuthenticatedApiClient();

  const queryParams = {
    pagination: {
      pageSize: pagination.pageSize,
      page: pagination.pageIndex + 1,
    },
    filters: {
      user: {
        $eq: userId,
      },
    },
    populate: "*",
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["schedules", pagination, userId, date_from, date_to],
    queryFn: () =>
      apiClient.get<GetSchedulesResponse>(`/schedules?${queryString}`),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    retry: queriesRetryStrategy,
  });

  return query;
};
