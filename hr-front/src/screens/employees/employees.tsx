import { Layout } from "@/components/layout/layout";
import { EmployeesTable } from "./components/employees-table";
import { PageHeader } from "@/components/page-header/page-header";
import { PageDescription } from "@/components/page-description/page-description";
import { EmployeesContextProvider } from "@/screens/employees/contexts/employees-context";
import { EmployeesModal } from "@/screens/employees/components/employees-modal";

export const Employees = () => {
  return (
    <EmployeesContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Pracownicy</PageHeader>
              <PageDescription>Lista wszystkich pracowników</PageDescription>
            </div>
          </div>
          <EmployeesTable />
          <EmployeesModal />
        </div>
      </Layout>
    </EmployeesContextProvider>
  );
};
