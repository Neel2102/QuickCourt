import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getMyReports,
  updateReport,
  deleteReport,
  canEditReport,
  canDeleteReport,
  formatReportStatus,
  formatReportType,
  getStatusColorClass
} from '../services/reportService';
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
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports: ' + (error.message || 'Unknown error'));
      setReports([]);
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
    return (
      <span className={`status-badge ${getStatusColorClass(status)}`}>
        {formatReportStatus(status)}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    return formatReportType(type);
  };

  if (loading) {
    return (
      <div className="my-reports-container" style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f8fafc' }}>
        <div className="loading-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
          color: '#64748b',
          fontSize: '1.125rem'
        }}>
          <div className="loading-spinner" style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '1rem'
          }}></div>
          Loading your reports...
        </div>
      </div>
    );
  }

  return (
    <div className="my-reports-container" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="my-reports-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1e293b' }}>My Reports</h1>
        <button
          className="new-report-button"
          onClick={() => setShowReportForm(true)}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + File New Report
        </button>
      </div>

      <div className="reports-filters" style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
          <label htmlFor="statusFilter" style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              background: 'white',
              fontSize: '0.875rem'
            }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
          <label htmlFor="typeFilter" style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>Type:</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              background: 'white',
              fontSize: '0.875rem'
            }}
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
        <div className="no-reports" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#64748b', fontSize: '1.125rem', margin: 0 }}>
            No reports found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map(report => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <div className="report-meta">
                  <span className="report-type">{formatReportType(report.targetType)}</span>
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
                    {canEditReport(report) && (
                      <button
                        onClick={() => handleEdit(report)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteReport(report) && (
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
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
          onReportSubmitted={() => {
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
