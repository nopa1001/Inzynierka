import { Layout } from "@/components/layout/layout";
import { DepartmentsTable } from "./components/departments-table";
import { DepartmentModal } from "@/screens/departments/components/department-modal";
import { DepartmentsContextProvider } from "@/screens/departments/contexts/departments-context";
import { PageHeader } from "@/components/page-header/page-header";
import { PageDescription } from "@/components/page-description/page-description";

export const Departments = () => {
  return (
    <DepartmentsContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Działy</PageHeader>
              <PageDescription>
                Lista wszystkich działów w organizacji
              </PageDescription>
            </div>
            <DepartmentModal />
          </div>
          <DepartmentsTable />
        </div>
      </Layout>
    </DepartmentsContextProvider>
  );
};
