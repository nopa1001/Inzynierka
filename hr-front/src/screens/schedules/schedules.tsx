import { Layout } from "@/components/layout/layout";
import { PageHeader } from "@/components/page-header/page-header";
import { EmployeeSchedule } from "@/screens/employee/components/employee-schedule";
import { useUser } from "@/hooks/api/user/use-user";
import { PageDescription } from "@/components/page-description/page-description";
import { ScheduleContextProvider } from "@/screens/employee/contexts/employee-schedule-context";
import { SchedulesModal } from "@/screens/employee/components/employee-schedule-modal";

export const Schedules = () => {
  const { data: user } = useUser();

  return (
    <ScheduleContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Mój grafik</PageHeader>
              <PageDescription>
                Kalendarz z godzinami pracy i urlopami/zwolnieniami
              </PageDescription>
            </div>
            <SchedulesModal />
          </div>
          <EmployeeSchedule
            userId={`${user?.id}`}
            showNameInHeader
            canEdit={false}
          />
        </div>
      </Layout>
    </ScheduleContextProvider>
  );
};
