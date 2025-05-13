import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search, Filter, Download, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { transactions, appointments } from "@/data/mockData";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

// Get transactions mock data
const fetchTransactions = async () => {
  return transactions;
};

// Get appointments mock data for revenue calculation
const fetchAppointments = async () => {
  return appointments;
};

// Mock financial summary data
const fetchFinancialSummary = async () => {
  return {
    totalRevenue: 25780,
    pendingPayments: 3450,
    receivedPayments: 22330,
    refundedAmount: 980,
    monthlyGrowth: 8.5,
  };
};

// Mock monthly revenue data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Fev', revenue: 17500 },
  { month: 'Mar', revenue: 16800 },
  { month: 'Abr', revenue: 18200 },
  { month: 'Mai', revenue: 19500 },
  { month: 'Jun', revenue: 21300 },
  { month: 'Jul', revenue: 20500 },
  { month: 'Ago', revenue: 22000 },
  { month: 'Set', revenue: 23800 },
  { month: 'Out', revenue: 24600 },
  { month: 'Nov', revenue: 25780 },
  { month: 'Dez', revenue: 0 },
];

// Mock payment methods data
const paymentMethodsData = [
  { name: 'Cartão de Crédito', value: 65 },
  { name: 'Cartão de Débito', value: 20 },
  { name: 'Dinheiro', value: 10 },
  { name: 'Pix', value: 5 },
];

// Pie chart colors
const COLORS = ['#0088FE', '#3A7BFD', '#00D861', '#FF4545'];

const Finance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedTab, setSelectedTab] = useState<string>("transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: fetchTransactions
  });

  const { data: appointmentsData, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: fetchAppointments
  });

  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['/api/financial-summary'],
    queryFn: fetchFinancialSummary
  });

  // Function to filter transactions based on search query
  const getFilteredTransactions = () => {
    if (!transactionsData) return [];

    let filtered = [...transactionsData];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        transaction => 
          transaction.reference.toLowerCase().includes(query) ||
          transaction.paymentMethod.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Function to render transaction status badge
  const renderStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Concluído
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            Pendente
          </div>
        );
      case 'refunded':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <TrendingDown className="h-3 w-3 mr-1" />
            Reembolsado
          </div>
        );
      case 'failed':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Falha
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </div>
        );
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="text-sm font-medium">{`${label}: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Financeiro</h2>
          <p className="text-sm text-gray-500">Gerenciamento financeiro da clínica</p>
        </div>
        
        <div className="flex items-center">
          <Button className="inline-flex items-center bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>
      
      {/* Period Selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={selectedPeriod === 'week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPeriod('week')}
        >
          Esta Semana
        </Button>
        <Button 
          variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPeriod('month')}
        >
          Este Mês
        </Button>
        <Button 
          variant={selectedPeriod === 'quarter' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPeriod('quarter')}
        >
          Este Trimestre
        </Button>
        <Button 
          variant={selectedPeriod === 'year' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPeriod('year')}
        >
          Este Ano
        </Button>
        <Button 
          variant={selectedPeriod === 'custom' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setSelectedPeriod('custom')}
        >
          Personalizado
        </Button>
      </div>
      
      {/* Financial Summary Cards */}
      {isLoadingSummary ? (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary?.totalRevenue || 0)}</p>
              <p className="text-sm text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {financialSummary?.monthlyGrowth}% vs mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <RefreshCw className="h-4 w-4 mr-1 text-yellow-500" />
                Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary?.pendingPayments || 0)}</p>
              <p className="text-sm text-gray-500">
                {Math.round((financialSummary?.pendingPayments || 0) / (financialSummary?.totalRevenue || 1) * 100)}% do total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCard className="h-4 w-4 mr-1 text-blue-500" />
                Pagamentos Recebidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary?.receivedPayments || 0)}</p>
              <p className="text-sm text-gray-500">
                {Math.round((financialSummary?.receivedPayments || 0) / (financialSummary?.totalRevenue || 1) * 100)}% do total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                Reembolsos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary?.refundedAmount || 0)}</p>
              <p className="text-sm text-gray-500">
                {Math.round((financialSummary?.refundedAmount || 0) / (financialSummary?.totalRevenue || 1) * 100)}% do total
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Revenue Chart and Payment Methods */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Visão geral da receita do ano atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyRevenueData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
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
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0088ff"
                    fill="rgba(0, 136, 255, 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Distribuição por forma de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {paymentMethodsData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm">{entry.name}</span>
                  </div>
                  <span className="font-medium">{entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Tab */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Transações</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar transação..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="completed">Concluídos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="refunded">Reembolsados</SelectItem>
                      <SelectItem value="failed">Falhas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="pix">Pix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2">
                  Limpar Filtros
                </Button>
                <Button size="sm">
                  Aplicar
                </Button>
              </div>
            </div>
          )}
          
          <Tabs 
            defaultValue="all" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-full mt-2"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="refunded">Reembolsos</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {isLoadingTransactions ? (
            <div className="p-8 text-center">
              <p>Carregando transações...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profissional</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredTransactions().map((transaction) => {
                    // Find patient and professional names from appointments
                    const appointment = appointmentsData?.find(a => a.id === transaction.appointmentId);
                    const patientName = appointment?.patient.name || 'Cliente não encontrado';
                    const professionalName = appointment?.professional.name || 'Profissional não encontrado';
                    
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.reference}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patientName}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{professionalName}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.status === 'refunded' ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {transaction.status === 'refunded' ? '-' : ''}{formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.paymentMethod === 'Credit Card' ? 'Cartão de Crédito' : 
                             transaction.paymentMethod === 'Pending' ? 'Pendente' : transaction.paymentMethod}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {renderStatusBadge(transaction.status)}
                        </td>
                      </tr>
                    );
                  })}
                  
                  {getFilteredTransactions().length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        Nenhuma transação encontrada para os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;
