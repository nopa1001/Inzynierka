import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type CreatePositionOptions = {
  data: {
    name: string;
  };
};

export type CreatePositionResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["createPosition"],
    mutationFn: (data: CreatePositionOptions) =>
      apiClient.post<CreatePositionResponse>("/positions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });

  return mutation;
};
