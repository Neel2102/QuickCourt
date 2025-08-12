import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderFacility from "../components/dashboard/HeaderFacility";
import FacilityManagement from "./owner/FacilityManagement";
import BookingDetails from "./BookingDetails";
import MyReports from "../components/MyReports";
import { getUserProfile } from "../services/userService";
import "../CSS/facilityDashboard.css";
import "../CSS/Dashboard.css";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardSection = ({ stats }) => (
  <section className="section-facilitydashboard">
    <h2>KPIs</h2>
    <div className="kpi-cards">
      <div className="kpi-card">
        <h4>Total Bookings</h4>
        <div>{stats?.totalBookings ?? 0}</div>
      </div>
      <div className="kpi-card">
        <h4>Active Courts</h4>
        <div>{stats?.activeCourts ?? 0}</div>
      </div>
      <div className="kpi-card">
        <h4>Earnings</h4>
        <div>₹{stats?.totalEarnings ?? 0}</div>
      </div>
    </div>
    <h3>Booking Trends</h3>
    <div style={{ minHeight: 200 }}>
      <Line data={{
        labels: stats?.bookingTrends?.map((t) => t._id) || [],
        datasets: [
          {
            label: "Bookings",
            data: stats?.bookingTrends?.map((t) => t.count) || [],
            fill: false,
            borderColor: "#43b97f",
            backgroundColor: "#43b97f",
            tension: 0.1,
          },
        ],
      }} options={{
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: 'Daily Booking Trends' },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Bookings' }, beginAtZero: true },
        },
      }} />
    </div>
  </section>
);

// ManageFacilitiesSection replaced with dedicated FacilityManagement component
const ManageCourtsSection = () => {
  const [courts, setCourts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [newCourt, setNewCourt] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    operatingHours: { start: '08:00', end: '22:00' }
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      fetchCourts();
    }
  }, [selectedVenue]);

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/venues/owner', { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setVenues(data.data || []);
        if (data.data.length > 0) {
          setSelectedVenue(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourts = async () => {
    if (!selectedVenue) return;
    try {
      const response = await fetch(`/api/courts/owner/${selectedVenue}`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setCourts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
    }
  };

  const handleAddCourt = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/courts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          venueId: selectedVenue,
          ...newCourt
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchCourts();
        setShowAddForm(false);
        setNewCourt({
          name: '',
          sportType: '',
          pricePerHour: '',
          operatingHours: { start: '08:00', end: '22:00' }
        });
        alert('Court added successfully!');
      } else {
        alert('Failed to add court: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding court:', error);
      alert('Error adding court: ' + error.message);
    }
  };

  const handleEditCourt = (court) => {
    setEditingCourt(court);
    setNewCourt({
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour,
      operatingHours: court.operatingHours
    });
    setShowEditForm(true);
  };

  const handleUpdateCourt = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/courts/${editingCourt._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newCourt)
      });

      const data = await response.json();
      if (data.success) {
        fetchCourts();
        setShowEditForm(false);
        setEditingCourt(null);
        setNewCourt({
          name: '',
          sportType: '',
          pricePerHour: '',
          operatingHours: { start: '08:00', end: '22:00' }
        });
        alert('Court updated successfully!');
      } else {
        alert('Failed to update court: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating court:', error);
      alert('Error updating court: ' + error.message);
    }
  };

  const handleDeleteCourt = async (courtId, courtName) => {
    if (window.confirm(`Are you sure you want to delete "${courtName}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/courts/${courtId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
          fetchCourts();
          alert('Court deleted successfully!');
        } else {
          alert('Failed to delete court: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting court:', error);
        alert('Error deleting court: ' + error.message);
      }
    }
  };

  if (loading) return <section className="section-facilitydashboard"><p>Loading courts...</p></section>;

  return (
    <section className="section-facilitydashboard">
      <div className="section-header">
        <h3>Manage Courts</h3>
        <div className="venue-selector">
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="venue-select"
          >
            <option value="">Select a venue</option>
            {venues.map(venue => (
              <option key={venue._id} value={venue._id}>{venue.name}</option>
            ))}
          </select>
        </div>
        {selectedVenue && (
          <button
            className="btn-facilitydashboard"
            onClick={() => setShowAddForm(true)}
          >
            Add Court
          </button>
        )}
      </div>

      {!selectedVenue ? (
        <div className="empty-state-facilitydashboard">
          <p>Please select a venue to manage its courts.</p>
        </div>
      ) : courts.length === 0 ? (
        <div className="empty-state-facilitydashboard">
          <p>No courts found for this venue. Add your first court!</p>
        </div>
      ) : (
        <div className="courts-grid-facilitydashboard">
          {courts.map(court => (
            <div key={court._id} className="court-card-facilitydashboard">
              <div className="court-header-facilitydashboard">
                <h4>{court.name}</h4>
                <span className="sport-type-facilitydashboard">{court.sportType}</span>
              </div>
              <div className="court-details-facilitydashboard">
                <p className="price-facilitydashboard">₹{court.pricePerHour}/hour</p>
                <p className="hours-facilitydashboard">{court.operatingHours.start} - {court.operatingHours.end}</p>
              </div>
              <div className="court-actions-facilitydashboard">
                <button
                  className="edit-btn-facilitydashboard"
                  onClick={() => handleEditCourt(court)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn-facilitydashboard"
                  onClick={() => handleDeleteCourt(court._id, court.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay-facilitydashboard">
          <div className="modal-facilitydashboard">
            <div className="modal-header-facilitydashboard">
              <h3>Add New Court</h3>
              <button onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddCourt} className="court-form-facilitydashboard">
              <div className="form-group-facilitydashboard">
                <label>Court Name</label>
                <input
                  type="text"
                  value={newCourt.name}
                  onChange={(e) => setNewCourt({...newCourt, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group-facilitydashboard">
                <label>Sport Type</label>
                <select
                  value={newCourt.sportType}
                  onChange={(e) => setNewCourt({...newCourt, sportType: e.target.value})}
                  required
                >
                  <option value="">Select sport</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                </select>
              </div>
              <div className="form-group-facilitydashboard">
                <label>Price per Hour (₹)</label>
                <input
                  type="number"
                  value={newCourt.pricePerHour}
                  onChange={(e) => setNewCourt({...newCourt, pricePerHour: e.target.value})}
                  required
                />
              </div>
              <div className="form-row-facilitydashboard">
                <div className="form-group-facilitydashboard">
                  <label>Opening Time</label>
                  <input
                    type="time"
                    value={newCourt.operatingHours.start}
                    onChange={(e) => setNewCourt({
                      ...newCourt,
                      operatingHours: {...newCourt.operatingHours, start: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="form-group-facilitydashboard">
                  <label>Closing Time</label>
                  <input
                    type="time"
                    value={newCourt.operatingHours.end}
                    onChange={(e) => setNewCourt({
                      ...newCourt,
                      operatingHours: {...newCourt.operatingHours, end: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions-facilitydashboard">
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="btn-facilitydashboard">Add Court</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingCourt && (
        <div className="modal-overlay-facilitydashboard">
          <div className="modal-facilitydashboard">
            <div className="modal-header-facilitydashboard">
              <h3>Edit Court</h3>
              <button onClick={() => {
                setShowEditForm(false);
                setEditingCourt(null);
                setNewCourt({
                  name: '',
                  sportType: '',
                  pricePerHour: '',
                  operatingHours: { start: '08:00', end: '22:00' }
                });
              }}>×</button>
            </div>
            <form onSubmit={handleUpdateCourt} className="court-form-facilitydashboard">
              <div className="form-group-facilitydashboard">
                <label>Court Name</label>
                <input
                  type="text"
                  value={newCourt.name}
                  onChange={(e) => setNewCourt({...newCourt, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group-facilitydashboard">
                <label>Sport Type</label>
                <select
                  value={newCourt.sportType}
                  onChange={(e) => setNewCourt({...newCourt, sportType: e.target.value})}
                  required
                >
                  <option value="">Select sport</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Cricket">Cricket</option>
                </select>
              </div>
              <div className="form-group-facilitydashboard">
                <label>Price per Hour (₹)</label>
                <input
                  type="number"
                  value={newCourt.pricePerHour}
                  onChange={(e) => setNewCourt({...newCourt, pricePerHour: e.target.value})}
                  required
                />
              </div>
              <div className="form-row-facilitydashboard">
                <div className="form-group-facilitydashboard">
                  <label>Opening Time</label>
                  <input
                    type="time"
                    value={newCourt.operatingHours.start}
                    onChange={(e) => setNewCourt({
                      ...newCourt,
                      operatingHours: {...newCourt.operatingHours, start: e.target.value}
                    })}
                    required
                  />
                </div>
                <div className="form-group-facilitydashboard">
                  <label>Closing Time</label>
                  <input
                    type="time"
                    value={newCourt.operatingHours.end}
                    onChange={(e) => setNewCourt({
                      ...newCourt,
                      operatingHours: {...newCourt.operatingHours, end: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions-facilitydashboard">
                <button type="button" onClick={() => {
                  setShowEditForm(false);
                  setEditingCourt(null);
                  setNewCourt({
                    name: '',
                    sportType: '',
                    pricePerHour: '',
                    operatingHours: { start: '08:00', end: '22:00' }
                  });
                }}>Cancel</button>
                <button type="submit" className="btn-facilitydashboard">Update Court</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

//const TimeSlotsSection = () => <section className="section-facilitydashboard"><h3>Time Slots</h3><p>Time slot management UI here.</p></section>;
const BookingsOverviewSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, upcoming, completed

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/owner', { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const today = new Date().toDateString();
    const now = new Date();

    switch (filter) {
      case 'today':
        return bookings.filter(booking =>
          new Date(booking.date).toDateString() === today
        );
      case 'upcoming':
        return bookings.filter(booking =>
          new Date(booking.date) >= now && booking.status === 'Confirmed'
        );
      case 'completed':
        return bookings.filter(booking =>
          booking.status === 'Completed'
        );
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) return <section className="section-facilitydashboard"><p>Loading bookings...</p></section>;

  return (
    <section className="section-facilitydashboard">
      <div className="section-header">
        <h3>Bookings Overview</h3>
        <div className="booking-filters-facilitydashboard">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button
            className={filter === 'today' ? 'active' : ''}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state-facilitydashboard">
          <p>No bookings found for the selected filter.</p>
        </div>
      ) : (
        <div className="bookings-list-facilitydashboard">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="booking-item-facilitydashboard">
              <div className="booking-info-facilitydashboard">
                <div className="booking-header-facilitydashboard">
                  <h4>{booking.court?.name} - {booking.venue?.name}</h4>
                  <span className={`booking-status-facilitydashboard ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details-facilitydashboard">
                  <p><strong>Customer:</strong> {booking.user?.name}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                  <p><strong>Sport:</strong> {booking.court?.sportType}</p>
                  <p><strong>Amount:</strong> ₹{booking.totalPrice}</p>
                </div>
              </div>
              {/* <div className="booking-actions-facilitydashboard">
                {booking.status === 'Confirmed' && (
                  <button 
                    className="complete-btn-facilitydashboard"
                    onClick={() => handleMarkComplete(booking._id, fetchBookings)}
                  >
                    Mark Complete
                  </button>
                )}
                <button 
                  className="view-btn-facilitydashboard"
                  onClick={() => handleViewDetails(booking._id, navigate)}
                >
                  View Details
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const handleMarkComplete = async (bookingId, fetchBookings) => {
  try {
    const response = await fetch(`/api/bookings/${bookingId}/complete`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      alert(`Booking ${bookingId} marked as complete successfully!`);
      fetchBookings();
    } else {
      alert(`Failed to mark booking ${bookingId} as complete.`);
    }
  } catch (error) { alert(`Error marking booking ${bookingId} as complete: ${error}`); }
};

const handleViewDetails = (bookingId, navigate) => {
  navigate(`/facility-dashboard/bookings/${bookingId}`);
};

const FacilityDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [owner, setOwner] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch owner profile data
        const ownerData = await getUserProfile();
        if (ownerData) {
          setOwner(ownerData);
        } else {
          // Fallback to localStorage
          setOwner({ name: localStorage.getItem("name") || "Owner" });
        }

        // Fetch dashboard stats
        const res = await fetch("/api/dashboard/owner", { credentials: "include" });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        // Fallback to localStorage for owner data
        setOwner({ name: localStorage.getItem("name") || "Owner" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const handleNavClick = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };
  const handleAddFacility = () => navigate("/facility-dashboard/manage-facilities");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "FacilityOwner") navigate("/login");
  }, [navigate]);

  if (loading) return <div className="section-facilitydashboard">Loading...</div>;
  if (error) return <div className="section-facilitydashboard" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="facility-dashboard">
      <HeaderFacility
        ownerName={owner?.name || "Owner"}
        ownerProfilePic={owner?.profilePic}
        onToggleSidebar={toggleSidebar}
      />
      <div className="dashboard__main">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
          role="FacilityOwner"
          userName={owner?.name || "Owner"}
          userAvatar={"🏟️"}
          userProfilePic={owner?.profilePic}
        />
        <main className="dashboard__content">
          <Routes>
            <Route path="" element={<DashboardSection stats={stats} />} />
            <Route path="manage-facilities" element={<FacilityManagement />} />
            <Route path="manage-courts" element={<ManageCourtsSection />} />
            <Route path="bookings-overview" element={<BookingsOverviewSection />} />
            <Route path="my-reports" element={<MyReports />} />
            <Route path="bookings/:bookingId" element={<BookingDetails />} />
            <Route path="*" element={<Navigate to="" replace />} />
           </Routes>
        </main>
      </div>
    </div>
  );
};

export default FacilityDashboard;