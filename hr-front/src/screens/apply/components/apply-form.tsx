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
import { useCreateApplication } from "@/hooks/api/applications/use-create-application";
import { getBase64 } from "@/utils/file-to-base64";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  surname: z.string().min(1).max(255),
  email: z.string().email().min(1).max(255),
  phone: z.string().min(1).max(9),
  salaryExpectations: z.string().min(1).max(255),
  cv: z.instanceof(FileList),
});

type Props = {
  onSubmitted: () => void;
};

export const ApplyForm: React.FC<Props> = ({ onSubmitted }) => {
  const { toast } = useToast();
  const { mutate: apply } = useCreateApplication();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      salaryExpectations: "",
      cv: undefined,
    },
  });
  const fileRef = form.register("cv");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cv = values.cv
      ? ((await getBase64(values.cv[0])) as string)
      : undefined;

    if (!cv) return;

    apply(
      { data: { ...values, cv } },
      {
        onSuccess: () => {
          toast({
            title: `Pomyślnie wysłano aplikację`,
            variant: "default",
            duration: 2000,
          });
          onSubmitted();
          form.reset();
        },
        onError: () => {
          toast({
            title: "Wystąpił błąd podczas wysyłania aplikacji",
            variant: "destructive",
            duration: 2000,
          });
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
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input placeholder="Janusz" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
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
                <Input placeholder="Kowalski" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
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
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                Adres email, na który chcesz otrzymać informację o postępie w
                rekrutacji
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer telefonu</FormLabel>
              <FormControl>
                <Input placeholder="123123123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salaryExpectations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oczekiwana stawka</FormLabel>
              <FormControl>
                <Input type="string" placeholder="6000" {...field} />
              </FormControl>
              <FormDescription>
                Oczekiwana stawka miesięczna w PLN
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CV</FormLabel>
              <FormControl>
                <Input
                  required
                  type="file"
                  accept="application/pdf"
                  placeholder="Plik z CV"
                  {...fileRef}
                  onChange={(event) => {
                    field.onChange(event.target?.files?.[0] ?? undefined);
                  }}
                />
              </FormControl>
              <FormDescription>Plik z CV w formacie PDF</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Aplikuj</Button>
      </form>
    </Form>
  );
};
