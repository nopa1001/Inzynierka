import { Layout } from "@/components/layout/layout";
import { PageHeader } from "@/components/page-header/page-header";
import { useParams } from "react-router-dom";
import { useEmployee } from "@/hooks/api/employees/use-employee";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/api/authorization/use-role";
import { useState } from "react";
import { EmployeeProfile } from "@/screens/employee/components/employee-profile";
import { EmployeeSchedule } from "@/screens/employee/components/employee-schedule";
import { ScheduleContextProvider } from "@/screens/employee/contexts/employee-schedule-context";
import { SchedulesModal } from "@/screens/employee/components/employee-schedule-modal";

export const Employee = () => {
  const { id } = useParams();
  const { data: employee } = useEmployee({ id });
  const { data: role } = useRole();
  const [mode, setMode] = useState<"profile" | "schedules">("profile");

  return (
    <ScheduleContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>
                {employee?.name} {employee?.surname}
              </PageHeader>
              <SchedulesModal />
            </div>
          </div>

          {role?.type === "hr" && (
            <div className="flex flex-row gap-4">
              <Button
                variant={mode === "profile" ? "default" : "secondary"}
                onClick={() => setMode("profile")}
              >
                Informacje
              </Button>
              <Button
                variant={mode === "schedules" ? "default" : "secondary"}
                onClick={() => setMode("schedules")}
              >
                Zarządzaj grafikiem
              </Button>
            </div>
          )}
          {mode === "profile" && <EmployeeProfile />}
          {mode === "schedules" && (
            <EmployeeSchedule userId={id} showNameInHeader={false} canEdit />
          )}
        </div>
      </Layout>
    </ScheduleContextProvider>
  );
};
