import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { appointments } from "../../data/mockData";
import { Appointment } from "../../types";
import { formatDate } from "../../lib/utils";

// Get appointments mock data
const fetchAppointments = async () => {
  return appointments;
};

const Appointments = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: fetchAppointments,
  });

  // Function to filter appointments based on tab
  const getFilteredAppointments = () => {
    if (!appointmentsData) return [];

    let filtered = [...appointmentsData];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          appointment.patient.name.toLowerCase().includes(query) ||
          appointment.service.name.toLowerCase().includes(query)
      );
    }

    // Filter by tab
    switch (selectedTab) {
      case "upcoming":
        return filtered.filter(
          (appointment) =>
            appointment.status === "scheduled" ||
            appointment.status === "confirmed"
        );
      case "completed":
        return filtered.filter(
          (appointment) => appointment.status === "completed"
        );
      case "cancelled":
        return filtered.filter(
          (appointment) =>
            appointment.status === "cancelled" ||
            appointment.status === "no_show"
        );
      default:
        return filtered;
    }
  };

  // Status badge component
  const renderStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full">
            <Check className="h-3 w-3" />
            <span className="text-xs font-medium">Confirmado</span>
          </div>
        );
      case "scheduled":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <Clock className="h-3 w-3" />
            <span className="text-xs font-medium">Aguardando</span>
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            <Check className="h-3 w-3" />
            <span className="text-xs font-medium">Concluído</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full">
            <X className="h-3 w-3" />
            <span className="text-xs font-medium">Cancelado</span>
          </div>
        );
      case "no_show":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
            <X className="h-3 w-3" />
            <span className="text-xs font-medium">Não compareceu</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
            <span className="text-xs font-medium">{status}</span>
          </div>
        );
    }
  };

  // Simplified calendar date picker
  const renderDatePicker = () => {
    const today = new Date();
    const dates = [];

    // Generate dates for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }

    return (
      <div className="flex space-x-1 overflow-x-auto py-2 mb-4 scrollbar-hide">
        <button className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </button>

        {dates.map((date) => {
          const dateString = date.toISOString().split("T")[0];
          const isSelected = dateString === selectedDate;
          const isToday = date.toDateString() === today.toDateString();

          return (
            <button
              key={dateString}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedDate(dateString)}>
              <span className="text-xs font-medium">
                {date
                  .toLocaleDateString("pt-BR", { weekday: "short" })
                  .toUpperCase()}
              </span>
              <span
                className={`text-lg font-medium ${
                  isToday && !isSelected ? "text-primary" : ""
                }`}>
                {date.getDate()}
              </span>
            </button>
          );
        })}

        <button className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Agendamentos</h2>
          <p className="text-sm text-gray-500">
            Gerencie todos os agendamentos da clínica
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, serviço..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-300"
            onClick={() => setFilterOpen(!filterOpen)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <div className="w-36">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="scheduled">Agendados</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profissional
              </label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Dra. Ana Silva</SelectItem>
                  <SelectItem value="2">Dr. Marcos Oliveira</SelectItem>
                  <SelectItem value="3">Dra. Paula Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serviço
              </label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Consulta Dermatológica</SelectItem>
                  <SelectItem value="2">Limpeza de Pele</SelectItem>
                  <SelectItem value="3">Consulta Nutricional</SelectItem>
                  <SelectItem value="4">Massagem Terapêutica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <Select defaultValue="today">
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Tabs
          defaultValue="upcoming"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            </TabsList>

            {renderDatePicker()}
          </div>

          <TabsContent value="upcoming" className="mt-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <p>Carregando agendamentos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Horário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredAppointments().map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {appointment.patient.profileImage ? (
                              <img
                                src={appointment.patient.profileImage}
                                alt={appointment.patient.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {appointment.patient.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patient.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {appointment.patient.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.service.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.professional.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{`${appointment.startTime} - ${appointment.endTime}`}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderStatusBadge(appointment.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(appointment.service.price)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.paymentStatus === "paid"
                              ? "Pago"
                              : "Pendente"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-primary hover:underline text-sm">
                              Editar
                            </button>
                            <button className="text-gray-500 hover:underline text-sm">
                              Detalhes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {getFilteredAppointments().length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-gray-500">
                          Nenhum agendamento encontrado para os filtros
                          selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {/* Same table structure with filtered data */}
            <div className="overflow-x-auto">
              {getFilteredAppointments().length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhum agendamento concluído encontrado.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Same table structure */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Horário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Appointments rows */}
                    {getFilteredAppointments().map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        {/* Same row structure as previous tab */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {appointment.patient.profileImage ? (
                              <img
                                src={appointment.patient.profileImage}
                                alt={appointment.patient.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {appointment.patient.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patient.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {appointment.patient.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.service.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.professional.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{`${appointment.startTime} - ${appointment.endTime}`}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderStatusBadge(appointment.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(appointment.service.price)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.paymentStatus === "paid"
                              ? "Pago"
                              : "Pendente"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-gray-500 hover:underline text-sm">
                              Detalhes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            {/* Same table structure with filtered data */}
            <div className="overflow-x-auto">
              {getFilteredAppointments().length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhum agendamento cancelado encontrado.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Same table structure */}
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Paciente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Horário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Appointments rows */}
                    {getFilteredAppointments().map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        {/* Same row structure as previous tabs */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {appointment.patient.profileImage ? (
                              <img
                                src={appointment.patient.profileImage}
                                alt={appointment.patient.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {appointment.patient.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patient.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {appointment.patient.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.service.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.professional.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{`${appointment.startTime} - ${appointment.endTime}`}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderStatusBadge(appointment.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(appointment.service.price)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.paymentStatus === "paid"
                              ? "Pago"
                              : "Pendente"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-primary hover:underline text-sm">
                              Reagendar
                            </button>
                            <button className="text-gray-500 hover:underline text-sm">
                              Detalhes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Appointments;
