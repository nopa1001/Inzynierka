import { useAuthToken } from "@/hooks/api/authentication/use-auth-token";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const authToken = useAuthToken();
  const isAuthenticated = !!authToken;
  const currentPath = window.location.pathname;
  const redirectPath = isAuthenticated ? "/" : `/login?redirect=${currentPath}`;

  return isAuthenticated ? children : <Navigate to={redirectPath} />;
};
