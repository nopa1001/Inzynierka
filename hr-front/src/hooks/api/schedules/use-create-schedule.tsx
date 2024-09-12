import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type CreateScheduleOptions = {
  data: {
    user: string;
    date_from: Date;
    date_to: Date;
  };
};

export type CreateScheduleResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["createSchedule"],
    mutationFn: (data: CreateScheduleOptions) =>
      apiClient.post<CreateScheduleResponse>("/schedules", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  return mutation;
};
