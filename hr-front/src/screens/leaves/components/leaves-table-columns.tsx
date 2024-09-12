import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLeavesContext } from "@/screens/leaves/contexts/leaves-context";
import { useDeleteLeave } from "@/hooks/api/leaves/use-delete-leave";
import { useToast } from "@/components/ui/use-toast";
import { Leave } from "@/hooks/api/leaves/use-leaves";
import { useRole } from "@/hooks/api/authorization/use-role";
import { format } from "date-fns";

export enum Type {
  VACATION = "Urlop",
  SICK_LEAVE = "Zwolnienie lekarskie",
}

export enum State {
  PENDING = "Oczekujący",
  APPROVED = "Akceptowany",
  REJECTED = "Odrzucony",
}

export const leavesTableColumns: ColumnDef<Leave>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.attributes.user.data.attributes.name,
    header: () => <div>Imię</div>,
    cell: ({ row }) => {
      const leave = row.original;

      return <div>{leave.attributes.user.data.attributes.name}</div>;
    },
  },
  {
    accessorKey: "surname",
    accessorFn: (row) => row.attributes.user.data.attributes.surname,
    header: () => <div>Nazwisko</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{department.attributes.user.data.attributes.surname}</div>;
    },
  },
  {
    accessorKey: "dateFrom",
    accessorFn: (row) => row.attributes.date_from,
    header: () => <div>Od</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{format(department.attributes.date_from, "dd.MM.yyyy")}</div>;
    },
  },
  {
    accessorKey: "dateTo",
    accessorFn: (row) => row.attributes.date_to,
    header: () => <div>Do</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{format(department.attributes.date_to, "dd.MM.yyyy")}</div>;
    },
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.attributes.type,
    header: () => <div>Typ</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{Type[department.attributes.type]}</div>;
    },
  },
  {
    accessorKey: "state",
    accessorFn: (row) => row.attributes.state,
    header: () => <div>Stan</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{State[department.attributes.state]}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openModal } = useLeavesContext();
      const { mutate: deletePosition } = useDeleteLeave();
      const { toast } = useToast();
      const { data: role } = useRole();

      const handleEdit = () => {
        openModal("edit", row.original);
      };

      const handleDelete = () => {
        const confirmResult = confirm(
          `Czy na pewno chcesz usunąć urlop/zwolnienie?`
        );

        if (!confirmResult) {
          return;
        }

        deletePosition(
          { id: row.original.id },
          {
            onSuccess: () => {
              toast({
                title: `Pomyślnie usunięto urlop/zwolnienie`,
                variant: "destructive",
                duration: 2000,
              });
            },
            onError: () => {
              toast({
                title: "Wystąpił błąd podczas usuwania urlopu/zwolnienia",
                variant: "destructive",
                duration: 2000,
              });
            },
          }
        );
      };

      const canEdit = () => {
        if (role?.type === "hr") {
          return true;
        }

        if (row.original.attributes.state === "PENDING") {
          return true;
        }

        return false;
      };

      const canDelete = () => {
        if (role?.type === "hr") {
          return true;
        }

        if (row.original.attributes.state === "PENDING") {
          return true;
        }

        return false;
      };

      const canManage = canEdit() || canDelete();

      return (
        <div className="flex w-full justify-end">
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Otwórz menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canEdit() && (
                  <DropdownMenuItem onClick={handleEdit}>
                    Edytuj
                  </DropdownMenuItem>
                )}
                {canDelete() && (
                  <DropdownMenuItem onClick={handleDelete}>
                    Usuń
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      );
    },
  },
];
