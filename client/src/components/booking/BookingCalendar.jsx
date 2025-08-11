import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ month = new Date(), onPrev, onNext, selectedDate, onSelectDate }) => {
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
  const selectedKey = selectedDate ? keyFor(new Date(selectedDate).getDate()) : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrev} className="p-2 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
        <h3 className="text-sm font-medium">{monthNames[monthIndex]} {year}</h3>
        <button onClick={onNext} className="p-2 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[11px] font-medium text-gray-600 mb-1">
        {weekDays.map(d => <div key={d} className="text-center">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, idx) => {
          const dateKey = d ? keyFor(d) : null;
          const isSelected = selectedDate && selectedDate.startsWith(dateKey || 'x');
          return (
            <button
              key={idx}
              disabled={!d}
              onClick={() => d && onSelectDate && onSelectDate(dateKey)}
              className={`h-10 rounded text-xs border ${d ? 'hover:bg-gray-50' : 'bg-transparent border-transparent'} ${isSelected ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'}`}
            >
              {d || ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar; 
