import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeavesModalForm } from "@/screens/leaves/components/leaves-modal-form";
import { useLeavesContext } from "@/screens/leaves/contexts/leaves-context";

export const LeavesModal: React.FC = () => {
  const { isModalOpen, openModal, closeModal, mode } = useLeavesContext();

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Dodaj nowy urlop/zwolnienie"
              : "Edytuj zwolnienie/urlop"}
          </DialogTitle>
        </DialogHeader>
        <LeavesModalForm />
      </DialogContent>
    </Dialog>
  );
};
