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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              placeholder="Enter the ID of the user, venue, or booking you want to report"
              required
            />
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
