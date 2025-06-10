import { Calendar, BarChart3, Users, Percent } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import ServicesPieChart from "../components/dashboard/ServicesPieChart";
import AppointmentsTable from "../components/dashboard/AppointmentsTable";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { 
  statistics, 
  weeklyRevenueData, 
  servicesPieChartData, 
  appointments,
  activityItems
} from "../data/mockData";
import { useState } from "react";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<string>('Últimos 30 dias');

  // Pie chart colors
  const pieChartColors = ['#0088ff', '#3a7bfd', '#00d861'];

  return (
    <div className="p-4 lg:p-6">
      {/* Date Range Selector */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Visão geral</h2>
          <p className="text-sm text-gray-500">Confira o desempenho da sua clínica</p>
        </div>
        
        <div className="flex items-center">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <span>{dateRange}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          stat={statistics[0]} 
          icon={<Calendar className="h-5 w-5" />}
          bgColor="bg-blue-50"
          iconColor="text-primary"
        />
        <StatsCard 
          stat={statistics[1]} 
          icon={<BarChart3 className="h-5 w-5" />}
          bgColor="bg-green-50"
          iconColor="text-accent"
        />
        <StatsCard 
          stat={statistics[2]} 
          icon={<Users className="h-5 w-5" />}
          bgColor="bg-indigo-50"
          iconColor="text-indigo-500"
        />
        <StatsCard 
          stat={statistics[3]} 
          icon={<Percent className="h-5 w-5" />}
          bgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RevenueChart data={weeklyRevenueData} title="Receita por serviço" />
        </div>
        
        {/* Services Pie Chart */}
        <div>
          <ServicesPieChart 
            data={servicesPieChartData} 
            title="Serviços mais vendidos"
            colors={pieChartColors}
          />
        </div>
      </div>
      
      {/* Appointments Table and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentsTable appointments={appointments} title="Agendamentos de hoje" />
        </div>
        <div>
          <ActivityFeed activities={activityItems} title="Atividades recentes" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
