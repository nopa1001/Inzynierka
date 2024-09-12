import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PositionsModalForm } from "@/screens/positions/components/positions-modal-form";
import { usePositionsContext } from "@/screens/positions/contexts/positions-context";

export const PositionsModal: React.FC = () => {
  const { isModalOpen, openModal, closeModal, mode } = usePositionsContext();

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
        <PositionsModalForm />
      </DialogContent>
    </Dialog>
  );
};
