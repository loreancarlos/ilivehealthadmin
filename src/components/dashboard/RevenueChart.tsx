import { useState } from 'react';
import { ChartData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: ChartData[];
  title: string;
}

const RevenueChart = ({ data, title }: RevenueChartProps) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200">
          <p className="text-sm">{`${label}: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-md ${period === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setPeriod('week')}
          >
            Semana
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-md ${period === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setPeriod('month')}
          >
            Mês
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-md ${period === 'year' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setPeriod('year')}
          >
            Ano
          </button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${value / 1000}K`;
                }
                return value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#0088ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
