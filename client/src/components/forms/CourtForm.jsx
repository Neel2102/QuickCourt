import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Tennis, DollarSign, Clock, Save, RotateCcw } from 'lucide-react';

const CourtForm = ({ court, venueId, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    operatingHours: {
      start: '08:00',
      end: '22:00'
    },
    description: '',
    isAvailable: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sportOptions = [
    'Badminton', 'Tennis', 'Football', 'Basketball', 
    'Cricket', 'Table Tennis', 'Volleyball', 'Squash'
  ];

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name || '',
        sportType: court.sportType || '',
        pricePerHour: court.pricePerHour || '',
        operatingHours: {
          start: court.operatingHours?.start || '08:00',
          end: court.operatingHours?.end || '22:00'
        },
        description: court.description || '',
        isAvailable: court.isAvailable !== false
      });
    }
  }, [court]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOperatingHoursChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Court name is required');
      return;
    }

    if (!formData.sportType) {
      toast.error('Please select a sport type');
      return;
    }

    if (!formData.pricePerHour || formData.pricePerHour <= 0) {
      toast.error('Please enter a valid price per hour');
      return;
    }

    if (formData.operatingHours.start >= formData.operatingHours.end) {
      toast.error('End time must be after start time');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          ...formData,
          venueId: venueId,
          pricePerHour: parseFloat(formData.pricePerHour)
        });
      }
    } catch (error) {
      toast.error('Failed to save court');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: court?.name || '',
      sportType: court?.sportType || '',
      pricePerHour: court?.pricePerHour || '',
      operatingHours: {
        start: court?.operatingHours?.start || '08:00',
        end: court?.operatingHours?.end || '22:00'
      },
      description: court?.description || '',
      isAvailable: court?.isAvailable !== false
    });
  };

  const isFormChanged = () => {
    if (!court) return true;
    return (
      formData.name !== court.name ||
      formData.sportType !== court.sportType ||
      formData.pricePerHour !== court.pricePerHour ||
      formData.operatingHours.start !== court.operatingHours?.start ||
      formData.operatingHours.end !== court.operatingHours?.end ||
      formData.description !== court.description ||
      formData.isAvailable !== court.isAvailable
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Tennis className="mr-2" size={24} />
        {court ? 'Edit Court' : 'Add New Court'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Court Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Court 1, Tennis Court A"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="sportType" className="block text-sm font-medium text-gray-700 mb-2">
              Sport Type *
            </label>
            <select
              id="sportType"
              name="sportType"
              value={formData.sportType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading || isSubmitting}
            >
              <option value="">Select Sport Type</option>
              {sportOptions.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <DollarSign className="mr-2" size={16} />
            Price Per Hour *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="pricePerHour"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
              disabled={loading || isSubmitting}
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock className="mr-2" size={16} />
            Operating Hours *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-xs text-gray-600 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={formData.operatingHours.start}
                onChange={(e) => handleOperatingHoursChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-xs text-gray-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={formData.operatingHours.end}
                onChange={(e) => handleOperatingHoursChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe the court, surface type, facilities, etc..."
            disabled={loading || isSubmitting}
          />
        </div>

        {/* Availability */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading || isSubmitting}
            />
            <span className="text-sm text-gray-700">Court is available for booking</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            disabled={loading || isSubmitting || !isFormChanged()}
          >
            <RotateCcw className="mr-2" size={16} />
            Reset
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting || !isFormChanged()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={16} />
                {court ? 'Update Court' : 'Create Court'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourtForm; 
