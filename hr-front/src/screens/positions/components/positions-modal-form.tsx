import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePositionsContext } from "@/screens/positions/contexts/positions-context";
import { useCreatePosition } from "@/hooks/api/positions/use-create-position";
import { useEditPosition } from "@/hooks/api/positions/use-edit-position";
const formSchema = z.object({ name: z.string().min(1).max(255) });

export const PositionsModalForm: React.FC = () => {
  const { closeModal, mode, position } = usePositionsContext();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const { mutate: createPosition } = useCreatePosition();
  const { mutate: editPosition } = useEditPosition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: position?.attributes.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (mode === "create") {
      createPosition(
        { data: { name: values.name } },
        {
          onSuccess: (response) => {
            toast({
              title: `Pomyślnie utworzono dział ${response.data.data.attributes.name}`,
              variant: "default",
              duration: 2000,
            });
            form.reset();
            setLoading(false);
            closeModal();
          },
          onError: () => {
            toast({
              title: "Wystąpił błąd podczas tworzenia działu",
              variant: "destructive",
              duration: 2000,
            });
            setLoading(false);
          },
        }
      );
      return;
    }

    editPosition(
      { data: { name: values.name }, id: position?.id },
      {
        onSuccess: (response) => {
          toast({
            title: `Pomyślnie edytowano pozycję ${response.data.data.attributes.name}`,
            variant: "default",
            duration: 2000,
          });
          form.reset();
          setLoading(false);
          closeModal();
        },
        onError: () => {
          toast({
            title: "Wystąpił błąd podczas edycji pozycji",
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
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 justify-center flex flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input placeholder="Nazwa działu" {...field} />
              </FormControl>
              <FormDescription>Wprowadź nazwę działu</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
          {mode === "create" ? "Utwórz" : "Edytuj"}
        </Button>
      </form>
    </Form>
  );
};
