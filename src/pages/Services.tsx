import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ToggleRight,
  Tag,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Service } from "../types";
import { formatCurrency } from "../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServiceStore } from "../store/serviceStore";
import { usePartnersStore } from "../store/partnersStore";
import * as z from "zod";
import { useCategoryStore } from "../store/categoryStore";
import { useAuthStore } from "../store/authStore";
import { useProfessionalStore } from "../store/professionalStore";
import { useClinicStore } from "../store/clinicStore";
import { useSpecialtyStore } from "../store/specialtyStore";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// Form schema for service
const serviceFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do serviço deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  price: z.coerce.number().min(0, {
    message: "O preço não pode ser negativo.",
  }),
  durationInMinutes: z.coerce.number().min(0, {
    message: "A duração não pode ser negativa.",
  }),
  categoryId: z.string({
    required_error: "Selecione uma categoria.",
  }),
  professionalId: z.string().optional(),
  clinicId: z.string(),
  specialtyId: z.string().optional(),
  isActive: z.boolean().default(false),
  tags: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const Services = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { clinic, professional } = useAuthStore();
  const {
    professionals,
    fetchProfessionals,
    isProfessionalsLoading,
    professionalsError,
  } = useProfessionalStore();
  const { clinics, fetchClinics, isClinicsLoading, clinicsError } =
    useClinicStore();
  const {
    services,
    isLoading,
    toggleServiceStatus,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServiceStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    specialties,
    professionalSpecialties,
    fetchSpecialties,
    fetchProfessionalSpecialties,
  } = useSpecialtyStore();
  const {
    partnerships,
    fetchClinicsPartnerships,
    fetchProfessionalsPartnerships,
  } = usePartnersStore();

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchSpecialties();

    !!clinic && fetchProfessionals();
    !!clinic && fetchProfessionalsPartnerships();

    !!professional && fetchProfessionalSpecialties(professional?.id);
    !!professional && fetchClinics();
    !!professional && fetchClinicsPartnerships();
  }, [fetchServices, fetchCategories]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      durationInMinutes: 0,
      categoryId: "",
      professionalId: !!professional ? professional.id : "",
      clinicId: !!clinic ? clinic.id : "",
      specialtyId: "",
      isActive: false,
      /* tags: "", */
    },
  });

  const selectedProfessional = form.watch("professionalId");

  useEffect(() => {
    if (selectedProfessional) {
      fetchProfessionalSpecialties(selectedProfessional);
    }
  }, [selectedProfessional]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      // Convert tags string to array
      const tagsArray = data.tags
        ? data.tags.split(",").map((tag) => tag.trim())
        : [];

      // Create service object
      const serviceData = data;
      console.log(serviceData);
      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      // Close the dialog
      setIsOpenDialog(false);
      setEditingService(null);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);

    // Prepare tags string from array
    /* const tagsString = service.tags.join(", "); */

    // Set form values
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price,
      durationInMinutes: service.durationInMinutes,
      categoryId: service.categoryId,
      professionalId: service.professionalId,
      clinicId: service.clinicId,
      specialtyId: service.specialtyId,
      isActive: service.isActive,
      /* tags: tagsString, */
    });

    setIsOpenDialog(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await deleteService(serviceId);
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleServiceStatus(id);
    } catch (e) {
      console.error(e);
    }
  };

  // Function to filter services based on selected category and search query
  const getFilteredServices = () => {
    if (!services) return [];
    let filtered = [...services];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.categoryId === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    return filtered
      .map((service) => {
        const professional = professionals.find(
          (pro) => pro.id === service.professionalId
        );
        return {
          service, // dados da solicitação (status, ids, etc.)
          professional, // dados completos do profissional
        };
      })
      .filter((item) => item.professional);
  };

  const partnershipProfessionalData = useMemo(() => {
    return partnerships
      .filter((p) => p.isActive)
      .map((partnership) => {
        const professional = professionals.find(
          (professional) => professional.id === partnership.professionalId
        );

        return {
          partnership, // dados da solicitação (status, ids, etc.)
          professional, // dados completos do profissional
        };
      })
      .filter((item) => item.professional); // remove casos onde a clinica não foi encontrada
  }, [professionals, partnerships]);

  const partnershipClinicData = useMemo(() => {
    return partnerships
      .filter((p) => p.isActive)
      .map((partnership) => {
        const clinic = clinics.find(
          (clinic) => clinic.id === partnership.clinicId
        );

        return {
          partnership, // dados da solicitação (status, ids, etc.)
          clinic, // dados completos do profissional
        };
      })
      .filter((item) => item.clinic); // remove casos onde a clinica não foi encontrada
  }, [clinics, partnerships]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    if (!categories) return "";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Visão geral</h2>
          <p className="text-sm text-gray-500">
            Gerencie os serviços oferecidos pela clínica
          </p>
        </div>

        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Serviço" : "Adicionar Novo Serviço"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Faça as alterações desejadas no serviço e clique em salvar."
                  : "Preencha os detalhes do novo serviço e adicione-o ao catálogo."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Serviço</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Consulta com Dermatologista"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Duração <span className="text-xs">(Minutos)</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories &&
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!!clinic && (
                  <FormField
                    control={form.control}
                    name="professionalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profissional Responsável</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um profissional (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partnershipProfessionalData.length > 0 &&
                              partnershipProfessionalData.map((partner) => (
                                <SelectItem
                                  key={partner.professional?.id}
                                  value={partner.professional?.id || ""}>
                                  {partner.professional?.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecione um profissional parceiro ativo que realizará
                          este serviço.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!!professional && (
                  <FormField
                    control={form.control}
                    name="clinicId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clinicas Parceiras</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma clinica (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partnershipClinicData.length > 0 &&
                              partnershipClinicData.map((partner) => (
                                <SelectItem
                                  key={partner.clinic?.id}
                                  value={partner.clinic?.id || ""}>
                                  {partner.clinic?.fantasyName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecione uma clinica com parceria ativa onde
                          realizará este serviço.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  disabled={!selectedProfessional}
                  control={form.control}
                  name="specialtyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={!selectedProfessional}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a especialidade (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professionalSpecialties.map((ps) => (
                            <SelectItem
                              key={ps?.specialtyId}
                              value={ps?.specialtyId || ""}>
                              {ps?.specialtyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione um profissional parceiro ativo que realizará
                        este serviço.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o serviço em detalhes..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (separadas por vírgula)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Convênio, Primeira consulta, Especialidade"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Adicione tags para facilitar a busca e categorização.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>
                          Serviços ativos são exibidos para agendamento.
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

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpenDialog(false);
                      setEditingService(null);
                      form.reset();
                    }}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingService ? "Salvar Alterações" : "Adicionar Serviço"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar serviços..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select
            defaultValue="all"
            value={selectedCategory}
            onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories &&
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-r-none border-r"
              onClick={() => setViewMode("grid")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <p>Carregando serviços...</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredServices().map((data) => (
                <Card
                  key={data.service.id}
                  className={!data.service.isActive ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {data.service.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline" className="mr-1">
                            {getCategoryName(data.service.categoryId)}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col font-bold ">
                        <div className="flex justify-center">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={data.professional?.perfilImage}
                              alt={data.professional?.name}
                            />
                            <AvatarFallback>
                              {getInitials(data.professional?.name || "?")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="text-lg">{data.professional?.name}</span>
                        <span className="text-xl text-primary">
                          {formatCurrency(data.service.price)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {data.service.durationInMinutes + " minutos"}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {data.service.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {/* {data.service.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs">
                          {tag}
                        </Badge>
                      ))} */}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 pt-1">
                    <div className="grid grid-rows-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status do Serviço
                        </span>
                        <Switch
                          checked={data.service.isActive}
                          onCheckedChange={() => {
                            handleToggleStatus(data.service.id);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(data.service.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(data.service)}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {getFilteredServices().length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                  Nenhum serviço encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Profissional
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Categoria
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duração
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preço
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredServices().map((data) => (
                    <tr
                      key={data.service.id}
                      className={
                        !data.service.isActive
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {data.service.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {data.service.description}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {/*  {data.service.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {data.service.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{data.service.tags.length - 2}
                            </Badge>
                          )} */}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {data.professional?.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {getCategoryName(data.service.categoryId)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {data.service.durationInMinutes + " min."}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(data.service.price)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            data.service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {data.service.isActive ? "Ativo" : "Inativo"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditService(data.service)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(data.service.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {getFilteredServices().length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500">
                        Nenhum serviço encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Services;
