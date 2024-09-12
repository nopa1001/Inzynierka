import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type DeleteDepartmentOptions = {
  id?: number;
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["deleteDepartment"],
    mutationFn: (data: DeleteDepartmentOptions) =>
      apiClient.delete(`/departments/${data.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  return mutation;
};
