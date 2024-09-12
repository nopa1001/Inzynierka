import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/api/user/use-user";

export const EmployeeProfile = () => {
  const { data: user } = useUser();

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Informacje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-muted-foreground">Imię:</span> {user?.name}
            </div>
            <div>
              <span className="text-muted-foreground">Nazwisko:</span>{" "}
              {user?.surname}
            </div>
            <div>
              <span className="text-muted-foreground">Data urodzenia:</span>{" "}
              {user?.dob}
            </div>
            <div>
              <span className="text-muted-foreground">Adres:</span>{" "}
              {user?.addressLine1}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kontakt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-muted-foreground">Email:</span>{" "}
              {user?.email}
            </div>
            <div>
              <span className="text-muted-foreground">Telefon:</span>{" "}
              {user?.phoneNumber}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Zatrudnienie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-muted-foreground">Dział:</span>{" "}
              {user?.department?.name}
            </div>
            <div>
              <span className="text-muted-foreground">Stanowisko:</span>{" "}
              {user?.position?.name}
            </div>
            <div>
              <span className="text-muted-foreground">Data zatrudnienia:</span>{" "}
              {user?.dateHired}
            </div>
            <div>
              <span className="text-muted-foreground">Miesięczna stawka:</span>{" "}
              {user?.monthlySalary}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
