import React from 'react';
import { CalendarClock } from 'lucide-react';

const RecentActivity = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 text-sm text-gray-600">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y">
      {items.map((item, index) => (
        <div key={index} className="p-4 flex items-start">
          <div className="p-2 bg-blue-50 rounded-md text-blue-600 mr-3">
            {item.icon || <CalendarClock className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{item.title}</p>
            {item.description && (
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
          {item.time && (
            <div className="text-xs text-gray-500">{item.time}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentActivity; 
