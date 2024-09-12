import { API_URL } from "@/config/api";
import axios from "axios";

export const useNotAuthenticatedApiClient = () => {
  const client = axios.create({
    baseURL: API_URL,
  });

  return client;
};
