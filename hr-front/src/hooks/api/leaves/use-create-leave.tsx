import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type CreateLeaveOptions = {
  data: {
    user: string;
    date_from: Date;
    date_to: Date;
    state: string;
    type: string;
  };
};

export type CreateLeaveResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["createLeave"],
    mutationFn: (data: CreateLeaveOptions) =>
      apiClient.post<CreateLeaveResponse>("/vacations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  return mutation;
};
