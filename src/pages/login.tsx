import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Checkbox } from "../components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuthStore } from "../store/authStore";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  password: z.string().min(1, {
    message: "A senha é obrigatória.",
  }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { clinicLogin, professionalLogin } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClinic, setIsClinic] = useState(false);
  const [_, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      if (isClinic) {
        await clinicLogin(values.email, values.password);
      } else {
        await professionalLogin(values.email, values.password);
      }
      navigate("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Credenciais inválidas"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleClinicOrProfessional = () => {
    if (isClinic) {
      setIsClinic(false);
    } else {
      setIsClinic(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <span className="text-primary font-bold text-3xl">
              iLive<span className="text-accent text-lg">health</span>
            </span>
            <span className="ml-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded self-start">
              ADMIN
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">
            Faça login na sua conta
          </CardTitle>
          <CardDescription>
            Acesse o painel administrativo da iLiveHealth
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="flex justify-center mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seuemail@exemplo.com"
                        type="email"
                        {...field}
                        disabled={isSubmitting}
                        onKeyDown={(e) => setError(null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Digite sua senha"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          disabled={isSubmitting}
                          onKeyDown={(e) => setError(null)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          onClick={togglePasswordVisibility}>
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Lembrar-me
                      </label>
                    </div>
                  )}
                />

                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium text-primary"
                  disabled={isSubmitting}>
                  Esqueceu a senha?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full border-gray-300">
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.501 12.2332C22.501 11.3699 22.4296 10.7399 22.2748 10.0865H12.2153V13.9832H18.12C18.001 14.9515 17.3582 16.4099 16.0296 17.3898L16.0055 17.5566L19.2027 20.0632L19.4343 20.0865C21.3106 18.1399 22.501 15.4665 22.501 12.2332Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.214 22.5C15.1068 22.5 17.5353 21.5667 19.4333 20.0867L16.0287 17.39C15.1069 18.0083 13.8501 18.4399 12.214 18.4399C9.38023 18.4399 6.97663 16.6083 6.11871 14.0767L5.96371 14.0883L2.6387 16.6966L2.56371 16.8483C4.45156 20.2633 8.0592 22.5 12.214 22.5Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.12053 14.0767C5.89391 13.4234 5.76426 12.7233 5.76426 12.0001C5.76426 11.2767 5.89391 10.5767 6.10768 9.92339L6.10011 9.74339L2.75095 7.10339L2.56429 7.15172C1.8667 8.60339 1.46655 10.2567 1.46655 12.0001C1.46655 13.7434 1.8667 15.3967 2.56429 16.8484L6.12053 14.0767Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.214 5.55997C14.2252 5.55997 15.583 6.41163 16.3569 7.12335L19.4176 4.23335C17.5231 2.53335 15.1068 1.5 12.214 1.5C8.05898 1.5 4.45135 3.73667 2.56348 7.15172L6.10687 9.92335C6.97663 7.39172 9.3802 5.55997 12.214 5.55997Z"
                    fill="#EB4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{" "}
            <a
              href="mailto:suporte@ilivehealth.com"
              className="font-medium text-primary hover:underline">
              Contate o suporte
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
