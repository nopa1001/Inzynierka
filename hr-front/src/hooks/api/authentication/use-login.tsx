import { useMutation } from "@tanstack/react-query";
import { useNotAuthenticatedApiClient } from "../api-client/use-not-authenticated-api-client";

export type LogInOptions = {
  identifier: string;
  password: string;
};

export type LogInResponse = {
  jwt: string;
};

export const useLogin = () => {
  const apiClient = useNotAuthenticatedApiClient();

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LogInOptions) =>
      apiClient.post<LogInResponse>("/auth/local", data),
    onSuccess: (response) => {
      localStorage.setItem("authToken", response.data.jwt);
    },
  });

  return mutation;
};
