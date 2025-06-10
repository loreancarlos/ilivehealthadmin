import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { services, serviceCategories } from "../data/mockData";
import { Service, ServiceCategory } from "../types";
import { formatCurrency } from "../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  duration: z.string().min(2, {
    message: "A duração deve ser especificada.",
  }),
  category: z.string({
    required_error: "Selecione uma categoria.",
  }),
  active: z.boolean().default(true),
  tags: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Get services mock data
const fetchServices = async () => {
  return services;
};

// Get service categories mock data
const fetchServiceCategories = async () => {
  return serviceCategories;
};

const Services = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["/api/services"],
    queryFn: fetchServices,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/service-categories"],
    queryFn: fetchServiceCategories,
  });

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: "",
      category: "",
      active: true,
      tags: "",
    },
  });

  const onSubmit = (data: ServiceFormValues) => {
    // In a real app, this would save the service to the backend
    console.log("Form submitted:", data);

    // Convert tags string to array
    const tagsArray = data.tags
      ? data.tags.split(",").map((tag) => tag.trim())
      : [];

    // Create service object
    const serviceData = {
      ...data,
      tags: tagsArray,
    };

    // Close the dialog
    setIsOpenDialog(false);
    setEditingService(null);
    form.reset();
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);

    // Prepare tags string from array
    const tagsString = service.tags.join(", ");

    // Set form values
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      active: service.active,
      tags: tagsString,
    });

    setIsOpenDialog(true);
  };

  const handleDeleteService = (serviceId: string) => {
    // In a real app, this would delete the service from the backend
    console.log("Delete service:", serviceId);
  };

  // Function to filter services based on selected category and search query
  const getFilteredServices = () => {
    if (!servicesData) return [];

    let filtered = [...servicesData];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
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

    return filtered;
  };

  // Function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    if (!categoriesData) return "";
    const category = categoriesData.find((cat) => cat.id === categoryId);
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
                          placeholder="Ex: Consulta Dermatológica"
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 30 minutos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
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
                          {categoriesData &&
                            categoriesData.map((category) => (
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

                <FormField
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
                />

                <FormField
                  control={form.control}
                  name="active"
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
              {categoriesData &&
                categoriesData.map((category) => (
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

      {isLoadingServices || isLoadingCategories ? (
        <div className="p-8 text-center">
          <p>Carregando serviços...</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredServices().map((service) => (
                <Card
                  key={service.id}
                  className={!service.active ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline" className="mr-1">
                            {getCategoryName(service.category)}
                          </Badge>
                          {!service.active && (
                            <Badge variant="outline" className="bg-gray-100">
                              Inativo
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(service.price)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {service.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                      className="text-primary hover:text-primary/80 hover:bg-primary/10">
                      <Edit className="h-4 w-4" />
                    </Button>
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
                  {getFilteredServices().map((service) => (
                    <tr
                      key={service.id}
                      className={
                        !service.active ? "bg-gray-50" : "hover:bg-gray-50"
                      }>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {service.description}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {service.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {service.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{service.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {getCategoryName(service.category)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {service.duration}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(service.price)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            service.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {service.active ? "Ativo" : "Inativo"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditService(service)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
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
