import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { useEmployeesContext } from "@/screens/employees/contexts/employees-context";
import { useNavigate } from "react-router-dom";
import { UserResponse } from "@/hooks/api/user/use-user";

export const employeesTableColumns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="flex flex-row justify-start p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Imię
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "surname",
    header: ({ column }) => {
      return (
        <Button
          className="flex flex-row justify-start p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nazwisko
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("surname")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="flex flex-row justify-start p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: () => <div>Rola</div>,
    cell: ({ row }) => {
      const employee = row.original;

      return <div>{employee.role?.name}</div>;
    },
  },
  {
    accessorKey: "department",
    header: () => <div>Dział</div>,
    cell: ({ row }) => {
      const employee = row.original;

      return <div>{employee.department?.name}</div>;
    },
  },
  {
    accessorKey: "position",
    header: () => <div>Pozycja</div>,
    cell: ({ row }) => {
      const employee = row.original;

      return <div>{employee.position?.name}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openModal } = useEmployeesContext();
      const navigate = useNavigate();

      const handleEdit = () => {
        openModal("edit", row.original);
      };

      const handleNavigateToProfile = () => {
        navigate(`/employees/${row.original.id}`);
      };

      return (
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
            <DropdownMenuItem onClick={handleNavigateToProfile}>
              Wyświetl profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>Edytuj</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
