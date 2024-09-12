import { API_URL } from "@/config/api";
import { useAuthToken } from "../authentication/use-auth-token";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useAuthenticatedApiClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const authToken = useAuthToken();
  const client = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${authToken}` },
  });

  // temp delay for testing purposes
  // client.interceptors.request.use((config) => {
  //   return new Promise((resolve) => setTimeout(() => resolve(config), 2000));
  // });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const currentPath = window.location.pathname;
        const navigateUrl = `/login?redirect=${currentPath}`;

        localStorage.removeItem("authToken");
        navigate(navigateUrl);
      }

      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 403) {
        const path = error.request.responseURL;

        toast({
          title: "Brak dostępu",
          duration: 2000,
          description: (
            <div className="flex flex-col gap-4">
              <span>Nie masz uprawnień do wykonania tej akcji.</span>
              <div>
                <span className="uppercase font-bold text-sm">
                  {error.response.config.method}:{" "}
                </span>
                <span className="break-all text-sm italic">{path}</span>
              </div>
            </div>
          ),
          variant: "destructive",
        });
      }

      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.code === "ERR_NETWORK") {
        toast({
          title: "Błąd sieci",
          duration: 2000,
          description: (
            <div className="flex flex-col gap-4">
              <span>Brak połączenia z serwerem.</span>
            </div>
          ),
          variant: "destructive",
        });
      }

      return Promise.reject(error);
    }
  );

  return client;
};
