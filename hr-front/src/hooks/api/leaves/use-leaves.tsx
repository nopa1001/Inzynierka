import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { PaginationResponse } from "@/types/common-api-types";
import { PaginationState } from "@tanstack/react-table";
import { stringify } from "qs";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";
import { UserResponse } from "@/hooks/api/user/use-user";

export type Leave = {
  id: number;
  attributes: {
    date_from: string;
    date_to: string;
    type: "SICK_LEAVE" | "VACATION";
    state: "PENDING" | "APPROVED" | "REJECTED";
    user: {
      data: {
        id: string;
        attributes: UserResponse;
      };
    };
  };
};

export type GetLeavesOptions = {
  pagination: PaginationState;
  userId?: number | string;
  date_from?: Date;
  date_to?: Date;
  state?: "PENDING" | "APPROVED" | "REJECTED";
};

export type GetLeavesResponse = {
  data: Leave[];
  meta: {
    pagination: PaginationResponse;
  };
};

export const useLeaves = ({
  pagination,
  userId,
  date_from,
  date_to,
  state,
}: GetLeavesOptions) => {
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
      state: {
        $eq: state,
      },
    },
    populate: "*",
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["leaves", pagination, userId, date_from, date_to],
    queryFn: () =>
      apiClient.get<GetLeavesResponse>(`/vacations?${queryString}`),
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    retry: queriesRetryStrategy,
  });

  return query;
};
