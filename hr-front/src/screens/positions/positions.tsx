import { Layout } from "@/components/layout/layout";
import { PageDescription } from "@/components/page-description/page-description";
import { PageHeader } from "@/components/page-header/page-header";
import { PositionsModal } from "@/screens/positions/components/positions-modal";
import { PositionsTable } from "@/screens/positions/components/positions-table";
import { PositionsContextProvider } from "@/screens/positions/contexts/positions-context";

export const Positions = () => {
  return (
    <PositionsContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Pozycje</PageHeader>
              <PageDescription>
                Lista wszystkich dostępnych pozycji w organizacji
              </PageDescription>
            </div>
            <PositionsModal />
          </div>
          <PositionsTable />
        </div>
      </Layout>
    </PositionsContextProvider>
  );
};
