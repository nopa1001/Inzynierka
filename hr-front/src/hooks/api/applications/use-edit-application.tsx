import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApiClient } from "@/hooks/api/api-client/use-authenticated-api-client";

export type EditApplicationOptions = {
  data: {
    state: "APPROVED" | "REJECTED";
  };
  id?: number;
};

export type EditApplicationResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
    };
  };
};

export const useEditApplication = () => {
  const queryClient = useQueryClient();
  const apiClient = useAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["editApplication"],
    mutationFn: ({ data, id }: EditApplicationOptions) =>
      apiClient.put<EditApplicationResponse>(`/applications/${id}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  return mutation;
};
