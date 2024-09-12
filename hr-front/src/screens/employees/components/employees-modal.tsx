import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmployeesModalForm } from "@/screens/employees/components/employees-modal-form";
import { useEmployeesContext } from "@/screens/employees/contexts/employees-context";

export const EmployeesModal: React.FC = () => {
  const { isModalOpen, closeModal, mode } = useEmployeesContext();

  const handleOpenChange = (nextChange: boolean) => {
    if (!nextChange) {
      closeModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Utwórz nowy dział" : "Edytuj dane pracownika"}
          </DialogTitle>
        </DialogHeader>
        <EmployeesModalForm />
      </DialogContent>
    </Dialog>
  );
};
