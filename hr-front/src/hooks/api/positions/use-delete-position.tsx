import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type DeletePositionOptions = {
  id?: number;
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["deletePosition"],
    mutationFn: (data: DeletePositionOptions) =>
      apiClient.delete(`/positions/${data.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });

  return mutation;
};
