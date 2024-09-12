import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DepartmentsModalForm } from "@/screens/departments/components/departments-modal-form";
import { useDepartmentsContext } from "@/screens/departments/contexts/departments-context";

export const DepartmentModal: React.FC = () => {
  const { isModalOpen, openModal, closeModal, mode } = useDepartmentsContext();

  const handleOpenChange = (nextChange: boolean) => {
    if (!nextChange) {
      closeModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => openModal("create")}>Dodaj</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Utwórz nowy dział" : "Edytuj dział"}
          </DialogTitle>
        </DialogHeader>
        <DepartmentsModalForm />
      </DialogContent>
    </Dialog>
  );
};
