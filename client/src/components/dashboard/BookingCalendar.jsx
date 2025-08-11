import React, { useMemo } from 'react';

const BookingCalendar = ({ month = new Date(), bookingsByDate = {}, onDayClick }) => {
  const { year, monthIndex, daysInMonth, firstDayOfWeek } = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(y, m, 1);
    return {
      year: y,
      monthIndex: m,
      daysInMonth: new Date(y, m + 1, 0).getDate(),
      firstDayOfWeek: first.getDay(),
    };
  }, [month]);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const keyFor = (d) => `${year}-${String(monthIndex+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{monthNames[monthIndex]} {year}</h3>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-600 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((d, idx) => {
          const dateKey = d ? keyFor(d) : null;
          const count = d ? (bookingsByDate[dateKey] || 0) : 0;
          return (
            <button
              key={idx}
              disabled={!d}
              onClick={() => d && onDayClick && onDayClick(dateKey)}
              className={`h-16 rounded border text-left p-2 ${d ? 'bg-gray-50 hover:bg-gray-100' : 'bg-transparent border-transparent'}`}
            >
              {d && (
                <>
                  <div className="text-xs text-gray-600">{d}</div>
                  {count > 0 && (
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                      {count} booking{count>1?'s':''}
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar; 
