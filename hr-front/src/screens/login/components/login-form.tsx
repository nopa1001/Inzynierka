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
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/api/authentication/use-login";

const formSchema = z.object({
  identifier: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export const LoginForm = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { mutate: logIn } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit({ identifier, password }: z.infer<typeof formSchema>) {
    const navigateUrl = new URLSearchParams(search).get("redirect") ?? "/";

    logIn({ identifier, password }, { onSuccess: () => navigate(navigateUrl) });
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
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login lub adres e-mail</FormLabel>
              <FormControl>
                <Input placeholder="adres@email.com" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input placeholder="" type="password" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Zaloguj się</Button>
      </form>
    </Form>
  );
};
