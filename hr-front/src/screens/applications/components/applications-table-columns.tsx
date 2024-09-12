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
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/hooks/api/applications/use-applications";
import { useEditApplication } from "@/hooks/api/applications/use-edit-application";

export enum State {
  PENDING = "Oczekujący",
  APPROVED = "Akceptowany",
  REJECTED = "Odrzucony",
}

export const applicationsTableColumns: ColumnDef<Application>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.attributes.name,
    header: () => <div>Imię</div>,
    cell: ({ row }) => {
      const leave = row.original;

      return <div>{leave.attributes.name}</div>;
    },
  },
  {
    accessorKey: "surname",
    accessorFn: (row) => row.attributes.surname,
    header: () => <div>Nazwisko</div>,
    cell: ({ row }) => {
      const application = row.original;

      return <div>{application.attributes.surname}</div>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => row.attributes.email,
    header: () => <div>Email</div>,
    cell: ({ row }) => {
      const application = row.original;

      return <div>{application.attributes.email}</div>;
    },
  },
  {
    accessorKey: "phone",
    accessorFn: (row) => row.attributes.phone,
    header: () => <div>Numer telefonu</div>,
    cell: ({ row }) => {
      const application = row.original;

      return <div>{application.attributes.phone}</div>;
    },
  },
  {
    accessorKey: "salaryExpectations",
    accessorFn: (row) => row.attributes.salaryExpectations,
    header: () => <div>Oczekiwania finansowe</div>,
    cell: ({ row }) => {
      const application = row.original;

      return <div>{application.attributes.salaryExpectations}</div>;
    },
  },
  {
    accessorKey: "cv",
    accessorFn: (row) => row.attributes.salaryExpectations,
    header: () => <div>CV</div>,
    cell: ({ row }) => {
      const application = row.original;

      return (
        application.attributes.cv && (
          <Button asChild variant="link" className="p-0 m-0">
            <a
              href={application.attributes.cv}
              download={`${row.original.attributes.name}_${row.original.attributes.surname}.pdf`}
            >
              Pobierz CV
            </a>
          </Button>
        )
      );
    },
  },
  {
    accessorKey: "state",
    accessorFn: (row) => row.attributes.state,
    header: () => <div>Stan</div>,
    cell: ({ row }) => {
      const application = row.original;

      return <div>{State[application.attributes.state]}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { mutate: editApplication } = useEditApplication();
      const { toast } = useToast();

      const handleChangeStatus = (status: "APPROVED" | "REJECTED") => {
        editApplication(
          {
            id: row.original.id,
            data: {
              state: status,
            },
          },
          {
            onSuccess: () => {
              toast({
                title: `Pomyślnie edytowano status`,
                variant: "default",
                duration: 2000,
              });
            },
            onError: () => {
              toast({
                title: "Wystąpił błąd podczas edytowania statusu",
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

              <DropdownMenuItem onClick={() => handleChangeStatus("APPROVED")}>
                Akceptuj
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleChangeStatus("REJECTED")}>
                Odrzuć
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
