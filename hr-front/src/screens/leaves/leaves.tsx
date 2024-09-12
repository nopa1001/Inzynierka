import { Layout } from "@/components/layout/layout";
import { PageDescription } from "@/components/page-description/page-description";
import { PageHeader } from "@/components/page-header/page-header";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/api/authorization/use-role";
import { LeavesModal } from "@/screens/leaves/components/leaves-modal";
import { LeavesTable } from "@/screens/leaves/components/leaves-table";
import { LeavesContextProvider } from "@/screens/leaves/contexts/leaves-context";
import { useState } from "react";

export const Leaves = () => {
  const { data: role } = useRole();
  const [mode, setMode] = useState<"manage" | "self">("self");

  return (
    <LeavesContextProvider>
      <Layout>
        <div className="flex flex-col h-screen overflow-y-auto bg-card p-8 gap-8">
          <div className="flex flex-row justify-between items-center">
            <div>
              <PageHeader>Zwolnienia i urlopy</PageHeader>
              <PageDescription>Lista urlopów pracowników</PageDescription>
            </div>
            <LeavesModal />
          </div>
          {role?.type === "hr" && (
            <div className="flex flex-row gap-4">
              <Button
                variant={mode === "self" ? "default" : "secondary"}
                onClick={() => setMode("self")}
              >
                Moje urlopy/zwolnienia
              </Button>
              <Button
                variant={mode === "manage" ? "default" : "secondary"}
                onClick={() => setMode("manage")}
              >
                Zarządzanie urlopami/zwolnieniami pracowników
              </Button>
            </div>
          )}
          <LeavesTable mode={mode} />
        </div>
      </Layout>
    </LeavesContextProvider>
  );
};
