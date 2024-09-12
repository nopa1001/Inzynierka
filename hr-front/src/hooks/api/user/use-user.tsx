import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "../api-client/use-authenticated-api-client";
import { queriesRetryStrategy } from "@/utils/queries-retry-strategy";

export type UserRole = {
  id: number;
  name: string;
  type: string;
};

export type UserDepartment = {
  id: number;
  name: string;
};

export type UserPosition = {
  id: number;
  name: string;
};

export type UserResponse = {
  id: number;
  email: string;
  username: string;
  name: string;
  surname: string;
  addressLine1: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole;
  department?: UserDepartment;
  position?: UserPosition;
  dob: string;
  phoneNumber: string;
  gender: string;
  monthlySalary: number;
  dateHired: string;
};

export const useUser = () => {
  const apiClient = useAuthenticatedApiClient();

  const query = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => apiClient.get<UserResponse>("/users/me?populate=*"),
    select: (response) => response.data,
    retry: queriesRetryStrategy,
  });

  return query;
};
