import React from 'react';

interface ChartCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  change?: number;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  children, 
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        
        {value && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {change !== undefined && (
              <span className={`text-sm ${getChangeColor(change)}`}>
                {formatChange(change)}
              </span>
            )}
          </div>
        )}
        
        {subtitle && (
          <p className="text-slate-400 text-sm">{subtitle}</p>
        )}
      </div>
      
      <div className="h-64 md:h-80">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;