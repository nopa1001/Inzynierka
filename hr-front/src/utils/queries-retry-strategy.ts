import { AxiosError } from "axios";

export const queriesRetryStrategy = (_: number, error: AxiosError) => {
  if (error.response?.status === 403) {
    return false;
  }

  if (error.code === "ERR_NETWORK") {
    return false;
  }

  return true;
};
