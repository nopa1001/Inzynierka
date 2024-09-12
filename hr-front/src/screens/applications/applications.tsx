import { Layout } from "@/components/layout/layout";
import { PageDescription } from "@/components/page-description/page-description";
import { PageHeader } from "@/components/page-header/page-header";
import { ApplicationsTable } from "@/screens/applications/components/applications-table";
import { LeavesContextProvider } from "@/screens/leaves/contexts/leaves-context";

export const Applications = () => {
  return (
    <LeavesContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Aplikacje o pracę</PageHeader>
              <PageDescription>Lista aplikacji o pracę</PageDescription>
            </div>
          </div>
          <ApplicationsTable />
        </div>
      </Layout>
    </LeavesContextProvider>
  );
};
