import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type EditPositionOptions = {
  data: {
    name: string;
  };
  id?: number;
};

export type EditPositionResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useEditPosition = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["editPosition"],
    mutationFn: ({ data, id }: EditPositionOptions) =>
      apiClient.put<EditPositionResponse>(`/positions/${id}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });

  return mutation;
};
