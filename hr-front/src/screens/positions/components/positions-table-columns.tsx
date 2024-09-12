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
import { Position } from "@/hooks/api/positions/use-positions";
import { useToast } from "@/components/ui/use-toast";
import { usePositionsContext } from "@/screens/positions/contexts/positions-context";
import { useDeletePosition } from "@/hooks/api/positions/use-delete-position";
import { useNavigate } from "react-router-dom";

export const positionsTableColumns: ColumnDef<Position>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.attributes.name,
    header: () => <div>Pozycja</div>,
    cell: ({ row }) => {
      const department = row.original;

      return <div>{department.attributes.name}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openModal } = usePositionsContext();
      const { mutate: deletePosition } = useDeletePosition();
      const { toast } = useToast();
      const navigate = useNavigate();

      const handleNavigate = () => {
        navigate(`/positions/${row.original.id}`);
      };

      const handleEdit = () => {
        openModal("edit", row.original);
      };

      const handleDelete = () => {
        const confirmResult = confirm(
          `Czy na pewno chcesz usunąć pozycję ${row.original.attributes.name}?`
        );

        if (!confirmResult) {
          return;
        }

        deletePosition(
          { id: row.original.id },
          {
            onSuccess: () => {
              toast({
                title: `Pomyślnie usunięto pozycję ${row.original.attributes.name}`,
                variant: "destructive",
                duration: 2000,
              });
            },
            onError: () => {
              toast({
                title: "Wystąpił błąd podczas usuwania pozycji",
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
                Przejdź do pozycji
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
