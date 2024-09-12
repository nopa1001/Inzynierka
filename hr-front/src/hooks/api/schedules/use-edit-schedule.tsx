import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type EditScheduleOptions = {
  data: {
    date_from: Date;
    date_to: Date;
  };
  id?: number;
};

export type EditScheduleResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useEditSchedule = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["editSchedule"],
    mutationFn: ({ data, id }: EditScheduleOptions) =>
      apiClient.put<EditScheduleResponse>(`/schedules/${id}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  return mutation;
};
