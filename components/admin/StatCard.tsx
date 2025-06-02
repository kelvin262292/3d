import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className = "" 
}) => {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className={`bg-slate-800 rounded-lg p-4 md:p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <p className={`text-sm ${getChangeColor(change)}`}>
              {formatChange(change)} from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;