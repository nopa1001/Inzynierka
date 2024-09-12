import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type CreateDepartmentOptions = {
  data: {
    name: string;
  };
};

export type CreateDepartmentResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["createDepartment"],
    mutationFn: (data: CreateDepartmentOptions) =>
      apiClient.post<CreateDepartmentResponse>("/departments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  return mutation;
};
