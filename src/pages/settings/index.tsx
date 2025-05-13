import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Clock,
  BellRing,
  Shield,
  CreditCard,
  Building,
  UserCog,
  Mail,
  Phone,
  Users,
  ChevronRight,
  Save,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { getInitials } from "../../lib/utils";

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }),
  bio: z.string().optional(),
  specialty: z.string().optional(),
  registrationNumber: z.string().optional(),
});

const clinicFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  description: z.string().optional(),
});

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Senha atual é obrigatória.",
    }),
    newPassword: z.string().min(8, {
      message: "Nova senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirme a nova senha.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

const notificationsSchema = z.object({
  appointmentReminder: z.boolean().default(true),
  appointmentConfirmation: z.boolean().default(true),
  appointmentCancellation: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  newFeatures: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ClinicFormValues = z.infer<typeof clinicFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type NotificationsValues = z.infer<typeof notificationsSchema>;

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.professional?.phoneNumber || "",
      bio: "",
      specialty: user?.professional?.specialty || "",
      registrationNumber: user?.professional?.registrationNumber || "",
    },
  });

  // Clinic form
  const clinicForm = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: user?.clinic?.name || "",
      email: user?.clinic?.email || "",
      phone: user?.clinic?.phoneNumber || "",
      address: user?.clinic?.address
        ? `${user.clinic.address.street}, ${user.clinic.address.number}, ${user.clinic.address.city} - ${user.clinic.address.state}`
        : "",
      description: user?.clinic?.description || "",
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notifications form
  const notificationsForm = useForm<NotificationsValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      appointmentReminder: true,
      appointmentConfirmation: true,
      appointmentCancellation: true,
      marketingEmails: false,
      newFeatures: true,
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log("Profile data:", data);
    // In a real app, this would send data to backend
  };

  const onClinicSubmit = (data: ClinicFormValues) => {
    console.log("Clinic data:", data);
    // In a real app, this would send data to backend
  };

  const onSecuritySubmit = (data: SecurityFormValues) => {
    console.log("Security data:", data);
    // In a real app, this would update password
  };

  const onNotificationsSubmit = (data: NotificationsValues) => {
    console.log("Notification settings:", data);
    // In a real app, this would update notification settings
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
        <p className="text-sm text-gray-500">
          Gerencie suas preferências e informações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <div className="md:border-r border-gray-200 pr-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Pessoal
            </h3>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
            <Button
              variant={activeTab === "clinic" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("clinic")}>
              <Building className="mr-2 h-4 w-4" />
              Dados da Clínica
            </Button>
            <Button
              variant={activeTab === "staff" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("staff")}>
              <Users className="mr-2 h-4 w-4" />
              Equipe
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Preferências
            </h3>
            <Button
              variant={activeTab === "schedule" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("schedule")}>
              <Clock className="mr-2 h-4 w-4" />
              Horários
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("notifications")}>
              <BellRing className="mr-2 h-4 w-4" />
              Notificações
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Sistema
            </h3>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("security")}>
              <Shield className="mr-2 h-4 w-4" />
              Segurança
            </Button>
            <Button
              variant={activeTab === "payment" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("payment")}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagamentos
            </Button>
          </div>
        </div>

        <div>
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Informações de Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={user?.professional?.profileImage}
                      alt={user?.name}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      Alterar foto
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Formatos PNG, JPG ou GIF de até 2MB
                    </p>
                  </div>
                </div>

                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="specialty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Especialidade</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registro profissional</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Por exemplo: CRM, CRO, CREFITO, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biografia</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva sua experiência profissional, especializações e áreas de atuação"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Esta informação será exibida publicamente para os
                            pacientes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Salvar alterações</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "clinic" && (
            <Card>
              <CardHeader>
                <CardTitle>Informações da Clínica</CardTitle>
                <CardDescription>
                  Gerencie os dados da sua clínica ou consultório
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      Adicionar logo
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Formatos PNG, JPG ou GIF de até 2MB
                    </p>
                  </div>
                </div>

                <Form {...clinicForm}>
                  <form
                    onSubmit={clinicForm.handleSubmit(onClinicSubmit)}
                    className="space-y-6">
                    <FormField
                      control={clinicForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da clínica</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={clinicForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email para contato</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clinicForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={clinicForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clinicForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da clínica</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva os serviços oferecidos, diferenciais e informações importantes"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Esta descrição será exibida publicamente para os
                            pacientes.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Salvar alterações</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Atualize sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form
                    onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                    className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha atual</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Sua senha deve ter pelo menos 8 caracteres e incluir
                            letras e números.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirme a nova senha</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Atualizar senha</Button>
                  </form>
                </Form>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Sessões ativas</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Dispositivo atual</p>
                        <p className="text-sm text-gray-500">
                          Chrome em Windows • São Paulo, Brasil
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Último acesso: Agora
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-50">
                        Ativo
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">iPhone 13</p>
                        <p className="text-sm text-gray-500">
                          Safari em iOS • São Paulo, Brasil
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Último acesso: 16 de junho, 2023
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Revogar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form
                    onSubmit={notificationsForm.handleSubmit(
                      onNotificationsSubmit
                    )}
                    className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Notificações de Agendamento
                      </h3>

                      <FormField
                        control={notificationsForm.control}
                        name="appointmentReminder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Lembretes de agendamento
                              </FormLabel>
                              <FormDescription>
                                Receba lembretes sobre agendamentos próximos.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="appointmentConfirmation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Confirmações de agendamento
                              </FormLabel>
                              <FormDescription>
                                Receba notificações quando um agendamento for
                                confirmado.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="appointmentCancellation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Cancelamentos
                              </FormLabel>
                              <FormDescription>
                                Receba notificações sobre cancelamentos de
                                agendamento.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Comunicação e Marketing
                      </h3>

                      <FormField
                        control={notificationsForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Emails de marketing
                              </FormLabel>
                              <FormDescription>
                                Receba dicas, promoções e novidades da
                                plataforma.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="newFeatures"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Novos recursos
                              </FormLabel>
                              <FormDescription>
                                Seja notificado sobre novos recursos da
                                plataforma.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">Salvar preferências</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === "schedule" && (
            <Card>
              <CardHeader>
                <CardTitle>Horários de Atendimento</CardTitle>
                <CardDescription>
                  Configure os dias e horários em que você está disponível para
                  agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Segunda",
                    "Terça",
                    "Quarta",
                    "Quinta",
                    "Sexta",
                    "Sábado",
                    "Domingo",
                  ].map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Switch id={`day-${index}`} />
                        <label
                          htmlFor={`day-${index}`}
                          className="ml-3 font-medium">
                          {day}
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select defaultValue="09:00">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Início" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">08:00</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="10:00">10:00</SelectItem>
                            <SelectItem value="custom">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <span>até</span>
                        <Select defaultValue="18:00">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Fim" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="17:00">17:00</SelectItem>
                            <SelectItem value="18:00">18:00</SelectItem>
                            <SelectItem value="19:00">19:00</SelectItem>
                            <SelectItem value="custom">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Intervalos</h3>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Almoço</p>
                      <p className="text-sm text-gray-500">
                        Intervalo de almoço diário
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select defaultValue="12:00">
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Início" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="13:00">13:00</SelectItem>
                          <SelectItem value="custom">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <span>até</span>
                      <Select defaultValue="13:00">
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Fim" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="13:00">13:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="custom">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button>Salvar horários</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "staff" && (
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle>Equipe</CardTitle>
                  <CardDescription>
                    Gerencie os profissionais da sua clínica
                  </CardDescription>
                </div>
                <Button>
                  <UserCog className="h-4 w-4 mr-2" />
                  Adicionar profissional
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "1",
                      name: "Dra. Ana Silva",
                      specialty: "Dermatologista",
                      email: "ana.silva@ilivehealth.com",
                      phone: "(11) 99999-1111",
                      profileImage:
                        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                    },
                    {
                      id: "2",
                      name: "Dr. Marcos Oliveira",
                      specialty: "Nutricionista",
                      email: "marcos.oliveira@ilivehealth.com",
                      phone: "(11) 99999-2222",
                      profileImage:
                        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                    },
                    {
                      id: "3",
                      name: "Dra. Paula Santos",
                      specialty: "Fisioterapeuta",
                      email: "paula.santos@ilivehealth.com",
                      phone: "(11) 99999-3333",
                      profileImage:
                        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
                    },
                  ].map((professional) => (
                    <div
                      key={professional.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                      <div className="flex items-center mb-4 md:mb-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={professional.profileImage}
                            alt={professional.name}
                          />
                          <AvatarFallback>
                            {getInitials(professional.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-medium">{professional.name}</p>
                          <p className="text-sm text-gray-500">
                            {professional.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
                        <div className="flex items-center text-sm text-gray-500 w-full md:w-auto">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{professional.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 w-full md:w-auto">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{professional.phone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary ml-auto">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>
                  Configure as formas de pagamento aceitas pela sua clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">
                        Cartão de crédito
                      </div>
                      <div className="text-sm text-gray-500">
                        Aceitar pagamentos via cartão de crédito
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">
                        Cartão de débito
                      </div>
                      <div className="text-sm text-gray-500">
                        Aceitar pagamentos via cartão de débito
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Pix</div>
                      <div className="text-sm text-gray-500">
                        Aceitar pagamentos via Pix
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Dinheiro</div>
                      <div className="text-sm text-gray-500">
                        Aceitar pagamentos em dinheiro na clínica
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">
                        Convênios de saúde
                      </div>
                      <div className="text-sm text-gray-500">
                        Aceitar convênios de saúde
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Dados bancários</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banco
                      </label>
                      <Select defaultValue="001">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="001">Banco do Brasil</SelectItem>
                          <SelectItem value="237">Bradesco</SelectItem>
                          <SelectItem value="341">Itaú</SelectItem>
                          <SelectItem value="033">Santander</SelectItem>
                          <SelectItem value="104">
                            Caixa Econômica Federal
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de conta
                      </label>
                      <Select defaultValue="cc">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cc">Conta Corrente</SelectItem>
                          <SelectItem value="cp">Conta Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agência
                      </label>
                      <Input type="text" placeholder="Número da agência" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conta
                      </label>
                      <Input type="text" placeholder="Número da conta" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titular da conta
                    </label>
                    <Input type="text" placeholder="Nome completo do titular" />
                    <p className="text-xs text-gray-500 mt-1">
                      O nome deve ser igual ao registrado no banco
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF/CNPJ do titular
                    </label>
                    <Input type="text" placeholder="CPF ou CNPJ do titular" />
                  </div>
                </div>

                <div className="mt-6">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
