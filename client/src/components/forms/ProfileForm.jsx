import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Camera, X, User, FileText, Save, RotateCcw } from 'lucide-react';

const ProfileForm = ({ user, onProfileUpdate, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePic: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profilePic: user.profilePic || ''
      });
      setImagePreview(user.profilePic || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setSelectedFile(file);
      const base64 = await convertToBase64(file);
      setImagePreview(base64);
      setFormData(prev => ({
        ...prev,
        profilePic: base64
      }));
    } catch (error) {
      toast.error('Failed to process image');
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

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      profilePic: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (formData.bio.length > 500) {
      toast.error('Bio should be less than 500 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onProfileUpdate) {
        await onProfileUpdate(formData);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      profilePic: user?.profilePic || ''
    });
    setImagePreview(user?.profilePic || '');
    setSelectedFile(null);
  };

  const isFormChanged = () => {
    return (
      formData.name !== (user?.name || '') ||
      formData.bio !== (user?.bio || '') ||
      formData.profilePic !== (user?.profilePic || '')
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <User className="mr-2" size={24} />
        Update Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
              
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex-1">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Camera className="mr-2" size={16} />
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
            disabled={loading || isSubmitting}
          />
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="mr-2" size={16} />
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell us about yourself..."
            disabled={loading || isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.bio.length}/500 characters
          </p>
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
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2" size={16} />
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 
