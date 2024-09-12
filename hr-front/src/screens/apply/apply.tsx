import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApplyForm } from "@/screens/apply/components/apply-form";
import { useState } from "react";

export const Apply = () => {
  const [mode, setMode] = useState<"create" | "sent">("create");

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {mode === "create" && (
        <Card className="min-w-96 w-1/3">
          <CardHeader>
            <CardTitle>Nowa aplikacja</CardTitle>
            <CardDescription>
              Wprowadź wymagane dane poniżej, by złożyć aplikację.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplyForm onSubmitted={() => setMode("sent")} />
          </CardContent>
        </Card>
      )}
      {mode === "sent" && (
        <Card className="min-w-96 w-1/3">
          <CardHeader>
            <CardTitle>Dziękujemy za złożenie aplikacji!</CardTitle>
            <CardDescription>
              O przebiegu rekrutacji będziesz informowany na podany adres email.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
