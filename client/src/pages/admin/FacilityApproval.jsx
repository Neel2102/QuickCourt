import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPendingFacilities, approveFacility } from '../../services/adminService';
import '../../CSS/AdminPanel.css';

const FacilityApproval = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    fetchPendingFacilities();
  }, []);

  const fetchPendingFacilities = async () => {
    try {
      setLoading(true);
      const data = await getPendingFacilities();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching pending facilities:', error);
      toast.error('Failed to load pending facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (facilityId, approved) => {
    try {
      await approveFacility(facilityId, approved);
      toast.success(`Facility ${approved ? 'approved' : 'rejected'} successfully!`);
      await fetchPendingFacilities(); // Refresh the list
      setShowDetails(false);
      setSelectedFacility(null);
    } catch (error) {
      console.error('Error updating facility approval:', error);
      toast.error('Failed to update facility approval');
    }
  };

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedFacility(null);
    setApprovalComment('');
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status ? 'approved' : 'pending'}`}>
        {status ? 'Approved' : 'Pending Approval'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="facility-approval-container">
        <div className="loading">Loading pending facilities...</div>
      </div>
    );
  }

  return (
    <div className="facility-approval-container">
      <div className="page-header">
        <h1>Facility Approval</h1>
        <p>Review and approve pending facility registrations</p>
      </div>

      {/* Summary Stats */}
      <div className="approval-stats">
        <div className="stat-card">
          <div className="stat-number">{facilities.length}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {facilities.filter(f => f.sportTypes?.length > 1).length}
          </div>
          <div className="stat-label">Multi-Sport Facilities</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {facilities.filter(f => f.amenities?.length > 5).length}
          </div>
          <div className="stat-label">Premium Facilities</div>
        </div>
      </div>

      {/* Facilities List */}
      <div className="facilities-section">
        <h2>Pending Facilities</h2>
        
        {facilities.length === 0 ? (
          <div className="no-facilities">
            <div className="no-facilities-icon">✅</div>
            <h3>No pending approvals</h3>
            <p>All facility registrations have been reviewed!</p>
          </div>
        ) : (
          <div className="facilities-list">
            {facilities.map(facility => (
              <div key={facility._id} className="facility-item">
                <div className="facility-basic-info">
                  <div className="facility-photo">
                    {facility.photos && facility.photos.length > 0 ? (
                      <img 
                        src={facility.photos[0]} 
                        alt={facility.name}
                        className="facility-thumbnail"
                      />
                    ) : (
                      <div className="no-photo">📷</div>
                    )}
                  </div>
                  
                  <div className="facility-details">
                    <h3>{facility.name}</h3>
                    <p className="facility-owner">
                      Owner: {facility.owner?.name || 'Unknown'}
                    </p>
                    <p className="facility-location">
                      📍 {facility.address?.city}, {facility.address?.state}
                    </p>
                    <p className="facility-sports">
                      🏃 {facility.sportTypes?.join(', ') || 'No sports specified'}
                    </p>
                    <div className="facility-meta">
                      <span className="meta-item">
                        📅 {new Date(facility.createdAt).toLocaleDateString()}
                      </span>
                      <span className="meta-item">
                        🏷️ {facility.amenities?.length || 0} amenities
                      </span>
                    </div>
                  </div>
                </div>

                <div className="facility-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(facility)}
                  >
                    View Details
                  </button>
                  <div className="quick-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(facility._id, true)}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleApprove(facility._id, false)}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Facility Details Modal */}
      {showDetails && selectedFacility && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedFacility.name}</h2>
              <button className="close-btn" onClick={closeDetails}>✕</button>
            </div>

            <div className="modal-body">
              <div className="facility-gallery">
                {selectedFacility.photos && selectedFacility.photos.length > 0 ? (
                  <div className="photo-grid">
                    {selectedFacility.photos.map((photo, index) => (
                      <img 
                        key={index}
                        src={photo} 
                        alt={`${selectedFacility.name} ${index + 1}`}
                        className="gallery-photo"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-photos">No photos uploaded</div>
                )}
              </div>

              <div className="facility-info-grid">
                <div className="info-section">
                  <h3>Basic Information</h3>
                  <div className="info-row">
                    <span className="info-label">Description:</span>
                    <span className="info-value">
                      {selectedFacility.description || 'No description provided'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Owner:</span>
                    <span className="info-value">
                      {selectedFacility.owner?.name || 'Unknown'} 
                      ({selectedFacility.owner?.email || 'No email'})
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Registration Date:</span>
                    <span className="info-value">
                      {new Date(selectedFacility.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Address</h3>
                  <div className="info-row">
                    <span className="info-label">Street:</span>
                    <span className="info-value">
                      {selectedFacility.address?.street || 'Not specified'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">City:</span>
                    <span className="info-value">
                      {selectedFacility.address?.city || 'Not specified'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">State:</span>
                    <span className="info-value">
                      {selectedFacility.address?.state || 'Not specified'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Postal Code:</span>
                    <span className="info-value">
                      {selectedFacility.address?.postalCode || 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Sports & Amenities</h3>
                  <div className="info-row">
                    <span className="info-label">Sport Types:</span>
                    <span className="info-value">
                      {selectedFacility.sportTypes?.length > 0 
                        ? selectedFacility.sportTypes.join(', ')
                        : 'No sports specified'
                      }
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Amenities:</span>
                    <span className="info-value">
                      {selectedFacility.amenities?.length > 0 
                        ? selectedFacility.amenities.join(', ')
                        : 'No amenities specified'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="approval-section">
                <h3>Approval Decision</h3>
                <div className="comment-section">
                  <label htmlFor="approval-comment">Comment (Optional):</label>
                  <textarea
                    id="approval-comment"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Add any comments about your decision..."
                    rows="3"
                  />
                </div>
                
                <div className="approval-actions">
                  <button 
                    className="approve-btn large"
                    onClick={() => handleApprove(selectedFacility._id, true)}
                  >
                    ✅ Approve Facility
                  </button>
                  <button 
                    className="reject-btn large"
                    onClick={() => handleApprove(selectedFacility._id, false)}
                  >
                    ❌ Reject Facility
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityApproval; 
