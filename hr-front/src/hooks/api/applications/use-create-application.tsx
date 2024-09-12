import { useNotAuthenticatedApiClient } from "@/hooks/api/api-client/use-not-authenticated-api-client";
import { useMutation } from "@tanstack/react-query";

export type ApplyOptions = {
  data: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    salaryExpectations: string;
    cv: string;
  };
};

export const useCreateApplication = () => {
  const apiClient = useNotAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["apply"],
    mutationFn: (data: ApplyOptions) => apiClient.post("/applications", data),
  });

  return mutation;
};
