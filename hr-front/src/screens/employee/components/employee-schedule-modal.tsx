import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SchedulesModalForm } from "@/screens/employee/components/employee-schedule-modal-form";
import { useScheduleContext } from "@/screens/employee/contexts/employee-schedule-context";

export const SchedulesModal: React.FC = () => {
  const { isModalOpen, closeModal, mode } = useScheduleContext();

  const handleOpenChange = (nextChange: boolean) => {
    if (!nextChange) {
      closeModal();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* <Button onClick={() => openModal("create")}>Dodaj</Button> */}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Dodaj nowy grafik" : "Edytuj grafil"}
          </DialogTitle>
        </DialogHeader>
        <SchedulesModalForm />
      </DialogContent>
    </Dialog>
  );
};
