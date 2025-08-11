import React from 'react';

const TimeSlotPicker = ({
  slots = [], // e.g. ['08:00','09:00'] or objects {start,end}
  selected,
  onChange,
  disabledSlots = [],
  className = ''
}) => {
  const isDisabled = (slot) => {
    const key = typeof slot === 'string' ? slot : `${slot.start}-${slot.end}`;
    return disabledSlots.includes(key);
  };

  const keyFor = (slot) => (typeof slot === 'string' ? slot : `${slot.start}-${slot.end}`);
  const labelFor = (slot) => (typeof slot === 'string' ? slot : `${slot.start} - ${slot.end}`);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 ${className}`}>
      {slots.map((slot, idx) => {
        const key = keyFor(slot);
        const label = labelFor(slot);
        const disabled = isDisabled(slot);
        const isSelected = selected === key || (typeof selected === 'object' && keyFor(selected) === key);
        return (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onChange && onChange(slot)}
            className={`px-3 py-2 text-sm rounded border transition-colors ${
              disabled
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker; 
