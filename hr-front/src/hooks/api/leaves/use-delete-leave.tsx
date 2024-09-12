import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type DeleteLeaveOptions = {
  id?: number;
};

export const useDeleteLeave = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["deleteLeave"],
    mutationFn: (data: DeleteLeaveOptions) =>
      apiClient.delete(`/vacations/${data.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  return mutation;
};
