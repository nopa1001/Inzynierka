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
import { Department } from "@/hooks/api/departments/use-departments";
import { useDepartmentsContext } from "@/screens/departments/contexts/departments-context";
import { useDeleteDepartment } from "@/hooks/api/departments/use-delete-department";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const departmentsTableColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.attributes.name,
    header: () => <div>Dział</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{department.attributes.name}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openModal } = useDepartmentsContext();
      const { mutate: deleteDepartment } = useDeleteDepartment();
      const { toast } = useToast();

      const navigate = useNavigate();

      const handleNavigate = () => {
        navigate(`/departments/${row.original.id}`);
      };

      const handleEdit = () => {
        openModal("edit", row.original);
      };

      const handleDelete = () => {
        const confirmResult = confirm(
          `Czy na pewno chcesz usunąć dział ${row.original.attributes.name}?`
        );

        if (!confirmResult) {
          return;
        }

        deleteDepartment(
          { id: row.original.id },
          {
            onSuccess: () => {
              toast({
                title: `Pomyślnie usunięto dział ${row.original.attributes.name}`,
                variant: "destructive",
                duration: 2000,
              });
            },
            onError: () => {
              toast({
                title: "Wystąpił błąd podczas usuwania działu",
                variant: "destructive",
                duration: 2000,
              });
            },
          }
        );
      };

      return (
        <div className="flex w-full justify-end">
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
              <DropdownMenuItem onClick={handleNavigate}>
                Przejdź do działu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>Edytuj</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>Usuń</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
