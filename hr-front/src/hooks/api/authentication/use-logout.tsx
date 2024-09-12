export type LogInOptions = {
  identifier: string;
  password: string;
};

export type LogInResponse = {
  jwt: string;
};

export const useLogout = () => {
  return () => localStorage.removeItem("authToken");
};
