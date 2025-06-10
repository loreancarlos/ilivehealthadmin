import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  BarChart3,
  LineChart,
  Clipboard,
  Download,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  weeklyRevenueData,
  servicesPieChartData,
  statistics,
} from "../data/mockData";
import { formatCurrency } from "../lib/utils";

// Mock data for reports
const monthlyRevenueData = [
  { month: "Jan", revenue: 15000, appointments: 85 },
  { month: "Fev", revenue: 17500, appointments: 95 },
  { month: "Mar", revenue: 16800, appointments: 90 },
  { month: "Abr", revenue: 18200, appointments: 102 },
  { month: "Mai", revenue: 19500, appointments: 110 },
  { month: "Jun", revenue: 21300, appointments: 125 },
  { month: "Jul", revenue: 20500, appointments: 118 },
  { month: "Ago", revenue: 22000, appointments: 128 },
  { month: "Set", revenue: 23800, appointments: 135 },
  { month: "Out", revenue: 24600, appointments: 140 },
  { month: "Nov", revenue: 25780, appointments: 145 },
  { month: "Dez", revenue: 0, appointments: 0 },
];

const professionalPerformanceData = [
  { name: "Dra. Ana Silva", appointments: 65, revenue: 16250 },
  { name: "Dr. Marcos Oliveira", appointments: 48, revenue: 9600 },
  { name: "Dra. Paula Santos", appointments: 32, revenue: 4800 },
];

const servicePerformanceData = [
  { name: "Consulta Dermatológica", count: 42, revenue: 10500 },
  { name: "Limpeza de Pele", count: 38, revenue: 6840 },
  { name: "Consulta Nutricional", count: 36, revenue: 7200 },
  { name: "Massagem Terapêutica", count: 29, revenue: 4350 },
];

// Colors for charts
const COLORS = ["#0088ff", "#3a7bfd", "#00d861", "#ff4545", "#9d70ff"];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedReport, setSelectedReport] = useState<string>("financial");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="text-sm font-medium">{`${label}`}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name === "revenue"
                ? `Receita: ${formatCurrency(item.value)}`
                : `${
                    item.name === "appointments" ? "Agendamentos" : item.name
                  }: ${item.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Toggle custom date selection
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    setIsCustomDate(value === "custom");
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Visão geral</h2>
          <p className="text-sm text-gray-500">
            Análise de desempenho e métricas da clínica
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-gray-300">
            <Clipboard className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
        </div>
      </div>

      {/* Date Selection and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
                  <SelectItem value="year">Ano atual</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isCustomDate && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data inicial
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data final
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="sm:self-end">
              <Button disabled={isCustomDate && (!startDate || !endDate)}>
                Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Type Tabs */}
      <Tabs
        defaultValue="financial"
        value={selectedReport}
        onValueChange={setSelectedReport}
        className="mb-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="financial">
            <BarChart3 className="h-4 w-4 mr-2" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <CalendarDays className="h-4 w-4 mr-2" />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="professionals">
            <LineChart className="h-4 w-4 mr-2" />
            Profissionais
          </TabsTrigger>
          <TabsTrigger value="services">
            <Clipboard className="h-4 w-4 mr-2" />
            Serviços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                label: "Receita Total",
                value: formatCurrency(statistics[1].value),
                change: `${statistics[1].change > 0 ? "+" : ""}${
                  statistics[1].change
                }%`,
                icon: <BarChart3 className="h-5 w-5 text-primary" />,
              },
              {
                label: "Ticket Médio",
                value: formatCurrency(172.07),
                change: "+4.2%",
                icon: <LineChart className="h-5 w-5 text-green-500" />,
              },
              {
                label: "Taxa de Cancelamento",
                value: "7.8%",
                change: "-1.2%",
                icon: <Clipboard className="h-5 w-5 text-yellow-500" />,
              },
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </CardTitle>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-sm ${
                      stat.change.includes("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                    {stat.change} vs período anterior
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>
                  Evolução da receita ao longo do ano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenueData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 10,
                      }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `R$${value / 1000}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        name="revenue"
                        dataKey="revenue"
                        fill="#0088ff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Receita</CardTitle>
                <CardDescription>
                  Receita por categoria de serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicesPieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name">
                        {servicesPieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {servicesPieChartData.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}></div>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho Financeiro por Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                        Profissional
                      </th>
                      <th className="text-left p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                        Atendimentos
                      </th>
                      <th className="text-left p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                        Receita
                      </th>
                      <th className="text-left p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                        Ticket Médio
                      </th>
                      <th className="text-left p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                        % do Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {professionalPerformanceData.map((professional, index) => {
                      const totalRevenue = professionalPerformanceData.reduce(
                        (sum, p) => sum + p.revenue,
                        0
                      );
                      const percentage = Math.round(
                        (professional.revenue / totalRevenue) * 100
                      );
                      const ticketAverage =
                        professional.revenue / professional.appointments;

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-900">
                            {professional.name}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {professional.appointments}
                          </td>
                          <td className="p-3 text-sm font-medium text-gray-900">
                            {formatCurrency(professional.revenue)}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {formatCurrency(ticketAverage)}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}

                    <tr className="bg-gray-50">
                      <td className="p-3 text-sm font-medium text-gray-900">
                        Total
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {professionalPerformanceData.reduce(
                          (sum, p) => sum + p.appointments,
                          0
                        )}
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {formatCurrency(
                          professionalPerformanceData.reduce(
                            (sum, p) => sum + p.revenue,
                            0
                          )
                        )}
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {formatCurrency(
                          professionalPerformanceData.reduce(
                            (sum, p) => sum + p.revenue,
                            0
                          ) /
                            professionalPerformanceData.reduce(
                              (sum, p) => sum + p.appointments,
                              0
                            )
                        )}
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        100%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                label: "Total de Agendamentos",
                value: statistics[0].value,
                change: `${statistics[0].change > 0 ? "+" : ""}${
                  statistics[0].change
                }%`,
                icon: <CalendarDays className="h-5 w-5 text-primary" />,
              },
              {
                label: "Taxa de Conversão",
                value: `${statistics[3].value}%`,
                change: `${statistics[3].change > 0 ? "+" : ""}${
                  statistics[3].change
                }%`,
                icon: <LineChart className="h-5 w-5 text-purple-500" />,
              },
              {
                label: "Taxa de Ocupação",
                value: "78.5%",
                change: "+3.2%",
                icon: <BarChart3 className="h-5 w-5 text-green-500" />,
              },
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </CardTitle>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-sm ${
                      stat.change.includes("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                    {stat.change} vs período anterior
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução de Agendamentos</CardTitle>
                <CardDescription>
                  Quantidade de agendamentos por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyRevenueData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 10,
                      }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        name="appointments"
                        type="monotone"
                        dataKey="appointments"
                        stroke="#3a7bfd"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Agendamentos</CardTitle>
                <CardDescription>Distribuição por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Confirmados", value: 65 },
                          { name: "Concluídos", value: 20 },
                          { name: "Cancelados", value: 10 },
                          { name: "Não Compareceu", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name">
                        {[
                          { name: "Confirmados", value: 65 },
                          { name: "Concluídos", value: 20 },
                          { name: "Cancelados", value: 10 },
                          { name: "Não Compareceu", value: 5 },
                        ].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { name: "Confirmados", value: 65 },
                    { name: "Concluídos", value: 20 },
                    { name: "Cancelados", value: 10 },
                    { name: "Não Compareceu", value: 5 },
                  ].map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}></div>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Agendamentos por Dia da Semana</CardTitle>
                <CardDescription>
                  Distribuição de agendamentos pela semana
                </CardDescription>
              </div>
              <div className="mt-2 md:mt-0">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos os serviços" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os serviços</SelectItem>
                    <SelectItem value="consultations">Consultas</SelectItem>
                    <SelectItem value="procedures">Procedimentos</SelectItem>
                    <SelectItem value="exams">Exames</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { day: "Segunda", count: 24 },
                      { day: "Terça", count: 18 },
                      { day: "Quarta", count: 22 },
                      { day: "Quinta", count: 26 },
                      { day: "Sexta", count: 30 },
                      { day: "Sábado", count: 16 },
                      { day: "Domingo", count: 9 },
                    ]}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar
                      name="Agendamentos"
                      dataKey="count"
                      fill="#0088ff"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professionals" className="mt-4">
          <Card className="mb-6">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Desempenho de Profissionais</CardTitle>
                <CardDescription>
                  Comparativo entre profissionais
                </CardDescription>
              </div>
              <div className="mt-2 md:mt-0 flex gap-2">
                <Select defaultValue="appointments">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Métrica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointments">Agendamentos</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                    <SelectItem value="rating">Avaliação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={professionalPerformanceData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 100,
                      bottom: 10,
                    }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      name="appointments"
                      dataKey="appointments"
                      fill="#0088ff"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão por Profissional</CardTitle>
                <CardDescription>
                  Porcentagem de consultas agendadas vs. realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: "Dra. Ana Silva", rate: 92 },
                    { name: "Dr. Marcos Oliveira", rate: 88 },
                    { name: "Dra. Paula Santos", rate: 95 },
                  ].map((professional, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {professional.name}
                        </span>
                        <span className="text-sm font-medium">
                          {professional.rate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${professional.rate}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avaliação de Satisfação</CardTitle>
                <CardDescription>
                  Média de avaliações por profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: "Dra. Ana Silva", rating: 4.8, reviews: 124 },
                    { name: "Dr. Marcos Oliveira", rating: 4.6, reviews: 98 },
                    { name: "Dra. Paula Santos", rating: 4.9, reviews: 87 },
                  ].map((professional, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(professional.rating)
                                    ? "text-yellow-400"
                                    : star <= professional.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            ({professional.reviews} avaliações)
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {professional.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card className="mb-6">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Serviços Mais Populares</CardTitle>
                <CardDescription>
                  Serviços com maior número de agendamentos
                </CardDescription>
              </div>
              <div className="mt-2 md:mt-0">
                <Select defaultValue="appointments">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointments">Agendamentos</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={servicePerformanceData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 150,
                      bottom: 10,
                    }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={140}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      name="count"
                      dataKey="count"
                      fill="#0088ff"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Serviço</CardTitle>
                <CardDescription>
                  Contribuição de cada serviço para a receita total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicePerformanceData.map((service) => ({
                          name: service.name,
                          value: service.revenue,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name">
                        {servicePerformanceData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          Serviço
                        </th>
                        <th className="text-right p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          Agendamentos
                        </th>
                        <th className="text-right p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          Receita
                        </th>
                        <th className="text-right p-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                          % do Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {servicePerformanceData.map((service, index) => {
                        const totalRevenue = servicePerformanceData.reduce(
                          (sum, s) => sum + s.revenue,
                          0
                        );
                        const percentage = Math.round(
                          (service.revenue / totalRevenue) * 100
                        );

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-900">
                              {service.name}
                            </td>
                            <td className="p-3 text-sm text-gray-900 text-right">
                              {service.count}
                            </td>
                            <td className="p-3 text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(service.revenue)}
                            </td>
                            <td className="p-3 text-sm text-gray-900 text-right">
                              {percentage}%
                            </td>
                          </tr>
                        );
                      })}

                      <tr className="bg-gray-50">
                        <td className="p-3 text-sm font-medium text-gray-900">
                          Total
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-900 text-right">
                          {servicePerformanceData.reduce(
                            (sum, s) => sum + s.count,
                            0
                          )}
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(
                            servicePerformanceData.reduce(
                              (sum, s) => sum + s.revenue,
                              0
                            )
                          )}
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-900 text-right">
                          100%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
