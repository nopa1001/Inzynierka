export const useAuthToken = () => {
  const authToken = localStorage.getItem("authToken");

  return authToken;
};
