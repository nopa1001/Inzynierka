import { Layout } from "@/components/layout/layout";
import { PageHeader } from "@/components/page-header/page-header";
import { EmployeesContextProvider } from "@/screens/employees/contexts/employees-context";
import { EmployeeProfile } from "@/screens/employee/components/employee-profile";

export const Home = () => {
  return (
    <EmployeesContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Home</PageHeader>
            </div>
          </div>
          <EmployeeProfile />
        </div>
      </Layout>
    </EmployeesContextProvider>
  );
};
