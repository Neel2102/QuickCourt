import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Building, MapPin, Phone, Globe, Image, Save, RotateCcw, X } from 'lucide-react';

const VenueForm = ({ venue, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    website: '',
    sportTypes: [],
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sportOptions = [
    'Badminton', 'Tennis', 'Football', 'Basketball', 
    'Cricket', 'Table Tennis', 'Volleyball', 'Squash'
  ];

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description || '',
        address: venue.address || '',
        city: venue.city || '',
        phone: venue.phone || '',
        website: venue.website || '',
        sportTypes: venue.sportTypes || [],
        images: venue.images || []
      });
      setImagePreviews(venue.images || []);
    }
  }, [venue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSportTypeChange = (sport) => {
    setFormData(prev => ({
      ...prev,
      sportTypes: prev.sportTypes.includes(sport)
        ? prev.sportTypes.filter(s => s !== sport)
        : [...prev.sportTypes, sport]
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error('Please select valid image files only');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image should be less than 5MB');
      return;
    }

    // Limit to 5 images
    if (selectedFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    try {
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);

      const newPreviews = await Promise.all(
        files.map(file => convertToBase64(file))
      );
      setImagePreviews(prev => [...prev, ...newPreviews]);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newPreviews]
      }));
    } catch (error) {
      toast.error('Failed to process images');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Venue name is required');
      return;
    }

    if (!formData.address.trim()) {
      toast.error('Address is required');
      return;
    }

    if (!formData.city.trim()) {
      toast.error('City is required');
      return;
    }

    if (formData.sportTypes.length === 0) {
      toast.error('Please select at least one sport type');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      toast.error('Failed to save venue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: venue?.name || '',
      description: venue?.description || '',
      address: venue?.address || '',
      city: venue?.city || '',
      phone: venue?.phone || '',
      website: venue?.website || '',
      sportTypes: venue?.sportTypes || [],
      images: venue?.images || []
    });
    setImagePreviews(venue?.images || []);
    setSelectedFiles([]);
  };

  const isFormChanged = () => {
    if (!venue) return true;
    return (
      formData.name !== venue.name ||
      formData.description !== venue.description ||
      formData.address !== venue.address ||
      formData.city !== venue.city ||
      formData.phone !== venue.phone ||
      formData.website !== venue.website ||
      JSON.stringify(formData.sportTypes) !== JSON.stringify(venue.sportTypes) ||
      JSON.stringify(formData.images) !== JSON.stringify(venue.images)
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Building className="mr-2" size={24} />
        {venue ? 'Edit Venue' : 'Add New Venue'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Venue Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter venue name"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter city"
              required
              disabled={loading || isSubmitting}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="mr-2" size={16} />
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter complete address"
            required
            disabled={loading || isSubmitting}
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Phone className="mr-2" size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
              disabled={loading || isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Globe className="mr-2" size={16} />
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              disabled={loading || isSubmitting}
            />
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
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe your venue, facilities, and amenities..."
            disabled={loading || isSubmitting}
          />
        </div>

        {/* Sport Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Sports *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sportOptions.map((sport) => (
              <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sportTypes.includes(sport)}
                  onChange={() => handleSportTypeChange(sport)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading || isSubmitting}
                />
                <span className="text-sm text-gray-700">{sport}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Image className="mr-2" size={16} />
            Venue Images (Max 5)
          </label>
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Image className="mr-2" size={16} />
              Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF up to 5MB each
            </p>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Venue ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
                {venue ? 'Update Venue' : 'Create Venue'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VenueForm; 
