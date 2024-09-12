import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthToken } from "@/hooks/api/authentication/use-auth-token";

export const Login = () => {
  const navigate = useNavigate();

  const authToken = useAuthToken();

  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  }, [navigate, authToken]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="max-w-96">
        <CardHeader>
          <CardTitle>Logowanie</CardTitle>
          <CardDescription>
            Wpisz swoje dane logowania poniżej, by kontynuować.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};
