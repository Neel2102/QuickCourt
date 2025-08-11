import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trendDirection, // 'up' | 'down' | undefined
  trendText,
  className = ''
}) => {
  const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-500';
  const TrendIcon = trendDirection === 'up' ? ArrowUpRight : trendDirection === 'down' ? ArrowDownRight : null;

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>

      {trendText && (
        <div className={`mt-3 flex items-center text-sm ${trendColor}`}>
          {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard; 
