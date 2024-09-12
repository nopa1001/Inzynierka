import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";
import { useRole } from "@/hooks/api/authorization/use-role";
import { PaginationResponse } from "@/types/common-api-types";
import { stringify } from "qs";

export type MenuItem = {
  name: string;
  href: string;
  icon: string;
};

export type MenuItemsResponse = {
  data: {
    id: number;
    attributes: {
      navItems: MenuItem[];
    };
  }[];
  pagination: PaginationResponse;
};

export const useMenuItems = () => {
  const { data: role } = useRole();
  const apiClient = useAuthenticatedApiClient();

  const queryParams = {
    filters: {
      role: {
        $eq: role?.type,
      },
    },
  };

  const queryString = stringify(queryParams);

  const query = useQuery({
    queryKey: ["menu", role?.id],
    queryFn: () => apiClient.get<MenuItemsResponse>(`/menus?${queryString}`),
    select: (response) => response.data.data[0],
    retry: queriesRetryStrategy,
    enabled: !!role?.id,
  });

  return query;
};
