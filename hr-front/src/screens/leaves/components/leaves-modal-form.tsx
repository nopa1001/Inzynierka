import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLeavesContext } from "@/screens/leaves/contexts/leaves-context";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/hooks/api/employees/use-employees";
import { useCreateLeave } from "@/hooks/api/leaves/use-create-leave";
import { useEditLeave } from "@/hooks/api/leaves/use-edit-leave";
import { useRole } from "@/hooks/api/authorization/use-role";
import { useUser } from "@/hooks/api/user/use-user";

const formSchema = z.object({
  user: z.string(),
  dateFrom: z.date(),
  dateTo: z.date(),
  state: z.string(),
  type: z.string(),
});

export const LeavesModalForm: React.FC = () => {
  const { data: role } = useRole();
  const { data: user } = useUser();
  const { closeModal, mode, leave } = useLeavesContext();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const { data: employees } = useEmployees({
    pagination: { pageIndex: 0, pageSize: 100 },
  });
  const { mutate: createLeave } = useCreateLeave();
  const { mutate: editLeave } = useEditLeave();

  const getDefaultUser = () => {
    if (leave?.attributes.user.data.id) {
      return `${leave?.attributes.user.data.id}`;
    }

    return role?.type === "hr" ? "" : `${user?.id}`;
  };

  const getDefaultState = () => {
    if (leave?.attributes.state) {
      return leave?.attributes.state;
    }

    return role?.type === "hr" ? "" : "PENDING";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: getDefaultUser(),
      dateFrom: leave?.attributes.date_from
        ? new Date(leave.attributes.date_from)
        : undefined,
      dateTo: leave?.attributes.date_to
        ? new Date(leave.attributes.date_to)
        : undefined,
      state: getDefaultState(),
      type: leave?.attributes.type ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (mode === "create") {
      createLeave(
        {
          data: {
            user: values.user,
            date_from: values.dateFrom,
            date_to: values.dateTo,
            state: values.state,
            type: values.type,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: `Pomyślnie utworzono urlop/zwolnienie`,
              variant: "default",
              duration: 2000,
            });
            setLoading(false);
            closeModal();
          },
          onError: () => {
            toast({
              title: "Wystąpił błąd podczas edycji urlopu/zwolnienia",
              variant: "destructive",
              duration: 2000,
            });
            setLoading(false);
          },
        }
      );
      return;
    }

    editLeave(
      {
        data: {
          date_from: values.dateFrom,
          date_to: values.dateTo,
          state: values.state,
          type: values.type,
        },
        id: leave?.id,
      },
      {
        onSuccess: () => {
          toast({
            title: `Pomyślnie edytowano urlop/zwolnienie`,
            variant: "default",
            duration: 2000,
          });
          setLoading(false);
          closeModal();
        },
        onError: () => {
          toast({
            title: "Wystąpił błąd podczas edycji urlopu/zwolnienia",
            variant: "destructive",
            duration: 2000,
          });
          setLoading(false);
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-y-8 gap-x-16 w-full mt-8">
          <FormField
            control={form.control}
            name="user"
            render={({ field }) => {
              const selectedEmployee = employees?.data.find(
                (employee) => `${employee.id}` === field.value
              );

              const label = field.value
                ? `${selectedEmployee?.name} ${selectedEmployee?.surname}`
                : "Wybierz pracownika";

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Pracownik</FormLabel>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      disabled={mode === "edit" || role?.type !== "hr"}
                    >
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {label}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Szukaj pracownika..." />
                        <CommandEmpty>Nie znaleziono pracownika.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {employees?.data.map((employee) => (
                              <CommandItem
                                value={`${employee.id}`}
                                key={employee.id}
                                onSelect={() => {
                                  form.setValue("user", `${employee.id}`);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    `${employee.id}` === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {employee.name} {employee.surname}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data od</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {role?.type === "hr" && (
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Stan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz stan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Oczekujący</SelectItem>
                      <SelectItem value="APPROVED">Akceptowany</SelectItem>
                      <SelectItem value="REJECTED">Odrzucony</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Typ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {role?.type === "hr" && (
                      <SelectItem value="SICK_LEAVE">
                        Zwolnienie lekarskie
                      </SelectItem>
                    )}
                    <SelectItem value="VACATION">Urlop</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8 w-full">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
            {mode === "create" ? "Utwórz" : "Edytuj"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
