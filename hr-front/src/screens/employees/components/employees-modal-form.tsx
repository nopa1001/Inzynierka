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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEmployeesContext } from "@/screens/employees/contexts/employees-context";
import { useEditEmployee } from "@/hooks/api/employees/use-edit-employee";
import { useDepartments } from "@/hooks/api/departments/use-departments";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { usePositions } from "@/hooks/api/positions/use-positions";
const formSchema = z.object({
  id: z.string().max(255),
  name: z.string().min(1).max(255),
  surname: z.string().min(1).max(255),
  gender: z.string(),
  dob: z.date(),
  email: z.string().email().max(255),
  phoneNumber: z.string().max(255),
  addressLine1: z.string().max(255),
  department: z.string().max(255),
  position: z.string().max(255),
  dateHired: z.date(),
  monthlySalary: z.string().max(255),
});

export const EmployeesModalForm = () => {
  const { employee, closeModal } = useEmployeesContext();
  const { mutate: editEmployee } = useEditEmployee({ id: employee?.id });
  const { data: departments } = useDepartments({
    pagination: { pageIndex: 0, pageSize: 100 },
  });
  const { data: positions } = usePositions({
    pagination: { pageIndex: 0, pageSize: 100 },
  });
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: `${employee?.id}` ?? "",
      name: employee?.name ?? "",
      surname: employee?.surname ?? "",
      email: employee?.email ?? "",
      phoneNumber: employee?.phoneNumber ?? "",
      addressLine1: employee?.addressLine1 ?? "",
      department: `${employee?.department?.id}` ?? "",
      position: `${employee?.position?.id}` ?? "",
      monthlySalary: `${employee?.monthlySalary}` ?? "",
      gender: employee?.gender ?? "",
      dateHired: employee?.dateHired ? new Date(employee.dateHired) : undefined,
      dob: employee?.dob ? new Date(employee.dob) : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setEditing(true);
    editEmployee(
      {
        data: {
          name: values.name,
          surname: values.surname,
          gender: values.gender,
          dob: values.dob,
          phoneNumber: values.phoneNumber,
          addressLine1: values.addressLine1,
          department: parseInt(values.department),
          position: parseInt(values.position),
          dateHired: values.dateHired,
          monthlySalary: parseInt(values.monthlySalary),
        },
      },
      {
        onSuccess: (response) => {
          toast({
            title: `Pomyślnie edytowano pracownika ${response.data.name} ${response.data.surname}`,
            variant: "default",
            duration: 2000,
          });
          closeModal();
        },
        onError: () => {
          toast({
            title: "Wystąpił błąd podczas edycji pracownika",
            variant: "destructive",
            duration: 2000,
          });
        },
        onSettled: () => {
          setEditing(false);
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-2 gap-y-8 gap-x-16 w-full mt-8">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Płeć</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Kobieta</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Mężczyzna</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data urodzenia</FormLabel>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input readOnly type="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer telefonu</FormLabel>
                <FormControl>
                  <Input placeholder="+48 790123123" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dział</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz dział" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments?.data.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={`${department.id}`}
                      >
                        {department.attributes.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pozycja</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz pozycję" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions?.data.map((position) => (
                      <SelectItem key={position.id} value={`${position.id}`}>
                        {position.attributes.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateHired"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data zatrudnienia</FormLabel>
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
            name="monthlySalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miesięczna stawka</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8 w-full">
          <Button type="submit" className="w-full" disabled={editing}>
            {editing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Edytuj
          </Button>
        </div>
      </form>
    </Form>
  );
};
