import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type EditDepartmentOptions = {
  data: {
    name: string;
  };
  id?: number;
};

export type EditDepartmentResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useEditDepartment = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["editDepartment"],
    mutationFn: ({ data, id }: EditDepartmentOptions) =>
      apiClient.put<EditDepartmentResponse>(`/departments/${id}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  return mutation;
};
