import { Statistic } from "../../types";
import { formatCurrency } from "../../lib/utils";

interface StatsCardProps {
  stat: Statistic;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const StatsCard = ({ stat, icon, bgColor, iconColor }: StatsCardProps) => {
  // Format value based on label
  const formatValue = (label: string, value: number) => {
    if (label.toLowerCase().includes('receita')) {
      return formatCurrency(value);
    }
    if (label.toLowerCase().includes('conversão')) {
      return `${value}%`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{stat.label}</span>
        <div className={`p-2 ${bgColor} rounded-full`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold">{formatValue(stat.label, stat.value)}</h3>
        <div className="flex items-center mt-1">
          <span className={`text-sm font-medium flex items-center ${
            stat.changeType === 'increase' 
              ? 'text-green-500' 
              : stat.changeType === 'decrease' 
                ? 'text-red-500' 
                : 'text-gray-500'
          }`}>
            {stat.changeType === 'increase' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : stat.changeType === 'decrease' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            {stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}
          </span>
          <span className="text-sm text-gray-500 ml-2">vs último mês</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
