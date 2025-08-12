import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fileReport } from '../services/reportService';
import '../CSS/ReportForm.css';

const ReportForm = ({ onReportSubmitted, onClose }) => {
  const [formData, setFormData] = useState({
    targetType: 'user',
    targetId: '',
    reason: '',
    actionNote: ''
  });

  const [loading, setLoading] = useState(false);
  const [sampleIds, setSampleIds] = useState(null);
  const [loadingSampleIds, setLoadingSampleIds] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTargetIdPlaceholder = () => {
    switch (formData.targetType) {
      case 'user':
        return 'e.g., 60f7b3b3b3b3b3b3b3b3b3b3 (User ID from profile)';
      case 'venue':
        return 'e.g., 60f7b3b3b3b3b3b3b3b3b3b4 (Venue ID from URL)';
      case 'booking':
        return 'e.g., 60f7b3b3b3b3b3b3b3b3b3b5 (Booking ID from confirmation)';
      default:
        return 'Enter the ID of the item you want to report';
    }
  };

  const getTargetIdHelpText = () => {
    switch (formData.targetType) {
      case 'user':
        return 'You can find the User ID in their profile URL or contact support for assistance.';
      case 'venue':
        return 'You can find the Venue ID in the venue page URL (e.g., /venue/[ID]).';
      case 'booking':
        return 'You can find the Booking ID in your booking confirmation email or booking details.';
      default:
        return 'Select a report type above to see specific guidance for finding the ID.';
    }
  };

  const fetchSampleIds = async () => {
    try {
      setLoadingSampleIds(true);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
      const response = await fetch(`${API_BASE}/reports/sample-ids`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setSampleIds(data.data);
        // Auto-fill with appropriate sample ID
        const sampleId = data.data[formData.targetType]?.id;
        if (sampleId) {
          setFormData(prev => ({ ...prev, targetId: sampleId }));
          toast.success(`Sample ${formData.targetType} ID loaded!`);
        }
      } else {
        toast.error('Failed to load sample IDs');
      }
    } catch (error) {
      console.error('Error fetching sample IDs:', error);
      toast.error('Failed to load sample IDs');
    } finally {
      setLoadingSampleIds(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.targetId || !formData.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const report = await fileReport(formData);
      toast.success('Report filed successfully!');
      
      if (onReportSubmitted) {
        onReportSubmitted(report);
      }
      
      // Reset form
      setFormData({
        targetType: 'user',
        targetId: '',
        reason: '',
        actionNote: ''
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to file report');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="report-form-overlay">
      <div className="report-form-container">
        <div className="report-form-header">
          <h2>File a Report</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="targetType">Report Type *</label>
            <select
              id="targetType"
              name="targetType"
              value={formData.targetType}
              onChange={handleInputChange}
              required
            >
              <option value="user">User</option>
              <option value="venue">Venue</option>
              <option value="booking">Booking</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="targetId">Target ID *</label>
            <input
              type="text"
              id="targetId"
              name="targetId"
              value={formData.targetId}
              onChange={handleInputChange}
              placeholder={getTargetIdPlaceholder()}
              required
            />
            <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              {getTargetIdHelpText()}
            </small>
            <button
              type="button"
              onClick={fetchSampleIds}
              disabled={loadingSampleIds}
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: loadingSampleIds ? 'not-allowed' : 'pointer',
                opacity: loadingSampleIds ? 0.6 : 1
              }}
            >
              {loadingSampleIds ? 'Loading...' : `Use Sample ${formData.targetType} ID`}
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Report *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please describe the issue or concern..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="actionNote">Additional Details (Optional)</label>
            <textarea
              id="actionNote"
              name="actionNote"
              value={formData.actionNote}
              onChange={handleInputChange}
              placeholder="Any additional information that might help..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Filing Report...' : 'File Report'}
            </button>
          </div>
        </form>

        <div className="report-form-footer">
          <p>
            <strong>Note:</strong> Reports are reviewed by administrators. 
            Please provide accurate and detailed information to help resolve your concern.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
