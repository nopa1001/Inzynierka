import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";
import { UserResponse } from "@/hooks/api/user/use-user";

export type EditEmployeeOptions = {
  data: {
    name: string;
    surname: string;
    phoneNumber: string;
    addressLine1: string;
    department: number;
    position: number;
    monthlySalary: number;
    gender: string;
    dateHired: Date;
    dob: Date;
  };
};

export type EditEmployeeResponse = UserResponse;

export const useEditEmployee = ({ id }: { id?: number }) => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["editEmployee"],
    mutationFn: ({ data }: EditEmployeeOptions) =>
      apiClient.put<EditEmployeeResponse>(`/users/${id}`, { ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });

  return mutation;
};
