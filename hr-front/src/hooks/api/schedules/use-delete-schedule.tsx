import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type DeleteScheduleOptions = {
  id?: number;
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["deleteSchedule"],
    mutationFn: (data: DeleteScheduleOptions) =>
      apiClient.delete(`/schedules/${data.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  return mutation;
};
