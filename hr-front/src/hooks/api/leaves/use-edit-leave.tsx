import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type EditLeaveOptions = {
  data: {
    date_from: Date;
    date_to: Date;
    state: string;
    type: string;
  };
  id?: number;
};

export type EditLeaveResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useEditLeave = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["editLeave"],
    mutationFn: ({ data, id }: EditLeaveOptions) =>
      apiClient.put<EditLeaveResponse>(`/vacations/${id}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
  });

  return mutation;
};
