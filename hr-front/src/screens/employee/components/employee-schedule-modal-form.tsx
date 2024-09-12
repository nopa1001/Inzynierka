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

import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/hooks/api/employees/use-employees";
import { useScheduleContext } from "@/screens/employee/contexts/employee-schedule-context";
import { useEditSchedule } from "@/hooks/api/schedules/use-edit-schedule";
import { useCreateSchedule } from "@/hooks/api/schedules/use-create-schedule";
import { useEmployee } from "@/hooks/api/employees/use-employee";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  user: z.string(),
  dateFrom: z.date(),
  dateTo: z.date(),
  type: z.string(),
});

export const SchedulesModalForm: React.FC = () => {
  const { id } = useParams();
  const { data: employee } = useEmployee({ id });
  const { closeModal, mode, schedule } = useScheduleContext();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const { data: employees } = useEmployees({
    pagination: { pageIndex: 0, pageSize: 100 },
  });
  const { mutate: editSchedule } = useEditSchedule();
  const { mutate: createSchedule } = useCreateSchedule();

  const getDefaultUser = () => {
    if (schedule?.attributes.user.data.id) {
      return `${schedule?.attributes.user.data.id}`;
    }

    return `${employee?.id}` ?? "";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: getDefaultUser(),
      dateFrom: schedule?.attributes.date_from
        ? new Date(schedule.attributes.date_from)
        : undefined,
      dateTo: schedule?.attributes.date_to
        ? new Date(schedule.attributes.date_to)
        : undefined,
      type: schedule?.attributes.type ?? "WORK",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onsubmit");
    setLoading(true);
    if (mode === "create") {
      createSchedule(
        {
          data: {
            user: values.user,
            date_from: values.dateFrom,
            date_to: values.dateTo,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: `Pomyślnie utworzono grafik`,
              variant: "default",
              duration: 2000,
            });
            setLoading(false);
            closeModal();
          },
          onError: () => {
            toast({
              title: "Wystąpił błąd podczas edycji grafiku",
              variant: "destructive",
              duration: 2000,
            });
            setLoading(false);
          },
        }
      );
      return;
    }

    editSchedule(
      {
        data: {
          date_from: values.dateFrom,
          date_to: values.dateTo,
        },
        id: schedule?.id,
      },
      {
        onSuccess: () => {
          toast({
            title: `Pomyślnie edytowano grafik`,
            variant: "default",
            duration: 2000,
          });
          setLoading(false);
          closeModal();
        },
        onError: () => {
          toast({
            title: "Wystąpił błąd podczas edycji grafiku",
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
                (e) => e.id === employee?.id
              );

              const label = selectedEmployee
                ? `${selectedEmployee?.name} ${selectedEmployee?.surname}`
                : "Wybierz pracownika";

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Pracownik</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild disabled>
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
