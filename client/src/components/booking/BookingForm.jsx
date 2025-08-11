import React, { useState } from 'react';
import TimeSlotPicker from './TimeSlotPicker.jsx';
import Button from '../common/Button.jsx';

const BookingForm = ({
  availableSlots = [],
  onSubmit,
  initialDate = '',
  className = ''
}) => {
  const [date, setDate] = useState(initialDate);
  const [slot, setSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !slot) return;
    setSubmitting(true);
    try {
      await onSubmit({ date, slot });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
        <TimeSlotPicker slots={availableSlots} selected={slot} onChange={setSlot} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={submitting} disabled={!date || !slot}>
          Book Now
        </Button>
      </div>
    </form>
  );
};

export default BookingForm; 
