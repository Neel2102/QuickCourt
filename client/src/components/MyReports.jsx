import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyReports, updateReport, deleteReport } from '../services/reportService';
import ReportForm from './ReportForm';
import '../CSS/MyReports.css';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editingReport, setEditingReport] = useState(null);
  const [editForm, setEditForm] = useState({ reason: '', actionNote: '' });
  const [showReportForm, setShowReportForm] = useState(false);

  const statuses = ['all', 'open', 'in_review', 'resolved'];
  const types = ['all', 'user', 'venue', 'booking'];

  useEffect(() => {
    fetchReports();
  }, [statusFilter, typeFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports(statusFilter, typeFilter);
      setReports(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report._id);
    setEditForm({
      reason: report.reason,
      actionNote: report.actionNote || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
    setEditForm({ reason: '', actionNote: '' });
  };

  const handleSaveEdit = async (reportId) => {
    try {
      await updateReport(reportId, editForm);
      toast.success('Report updated successfully');
      setEditingReport(null);
      setEditForm({ reason: '', actionNote: '' });
      fetchReports();
    } catch (error) {
      toast.error(error.message || 'Failed to update report');
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        toast.success('Report deleted successfully');
        fetchReports();
      } catch (error) {
        toast.error(error.message || 'Failed to delete report');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      open: 'status-open',
      in_review: 'status-in_review',
      resolved: 'status-resolved'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="my-reports-container">
        <div className="loading">Loading your reports...</div>
      </div>
    );
  }

  return (
    <div className="my-reports-container">
      <div className="page-header">
        <h1>My Reports</h1>
        <p>View and manage reports you have filed</p>
        <button 
          className="file-report-btn"
          onClick={() => setShowReportForm(true)}
        >
          🚨 File New Report
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="typeFilter">Type:</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : getTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="no-reports">
          <p>No reports found matching your criteria.</p>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map(report => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <div className="report-meta">
                  <span className="report-type">{getTypeLabel(report.targetType)}</span>
                  {getStatusBadge(report.status)}
                </div>
                <div className="report-date">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="report-content">
                <h3 className="report-reason">{report.reason}</h3>
                {report.actionNote && (
                  <p className="report-note">{report.actionNote}</p>
                )}
              </div>

              <div className="report-actions">
                {editingReport === report._id ? (
                  <div className="edit-form">
                    <textarea
                      value={editForm.reason}
                      onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Reason for report"
                      rows="3"
                    />
                    <textarea
                      value={editForm.actionNote}
                      onChange={(e) => setEditForm(prev => ({ ...prev, actionNote: e.target.value }))}
                      placeholder="Additional details (optional)"
                      rows="2"
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleSaveEdit(report._id)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {report.status === 'open' && (
                      <>
                        <button
                          onClick={() => handleEdit(report)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          onClose={() => setShowReportForm(false)}
          onReportSubmitted={(report) => {
            setShowReportForm(false);
            fetchReports(); // Refresh the reports list
            toast.success('Report filed successfully!');
          }}
        />
      )}
    </div>
  );
};

export default MyReports;
