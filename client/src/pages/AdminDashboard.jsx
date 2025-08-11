import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderAdmin from "../components/dashboard/HeaderAdmin";
import "../CSS/adminDashboard.css";
import "../CSS/Dashboard.css";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import AdminAnalytics from "./admin/Analytics";
import UserManagement from "./admin/UserManagement";
import Reports from "./admin/Reports";
import AdminProfile from "./admin/AdminProfile";
import { getUserProfile } from "../services/userService";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardSection = ({ stats, chartData, chartOptions }) => (
  <>
    <section className="section-adminDashboard">
      <h2>Global Stats</h2>
      <div className="kpi-cards">
        <div className="kpi-card">
          <h4>Total Users</h4>
          <div>{stats?.totalUsers ?? 0}</div>
        </div>
        <div className="kpi-card">
          <h4>Facility Owners</h4>
          <div>{stats?.totalFacilityOwners ?? 0}</div>
        </div>
        <div className="kpi-card">
          <h4>Total Bookings</h4>
          <div>{stats?.totalBookings ?? 0}</div>
        </div>
        <div className="kpi-card">
          <h4>Active Courts</h4>
          <div>{stats?.totalActiveCourts ?? 0}</div>
        </div>
      </div>
    </section>
    <section className="section-adminDashboard">
      <h3>Booking Activity Over Time</h3>
      <div style={{ minHeight: 200 }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </section>
    <section className="section-adminDashboard">
      <h3>Most Active Sports</h3>
      <ul>
        <li>Badminton</li>
        <li>Football</li>
        <li>Tennis</li>
      </ul>
    </section>
  </>
);

const FacilityApprovalsSection = ({ pendingVenues, onApprove, onReject }) => {
  const [loading, setLoading] = useState({});

  const handleApprove = async (venueId) => {
    setLoading(prev => ({ ...prev, [venueId]: true }));
    try {
      const response = await fetch(`/api/admin/venues/${venueId}/approve`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        onApprove(venueId);
      }
    } catch (error) {
      console.error('Error approving venue:', error);
    } finally {
      setLoading(prev => ({ ...prev, [venueId]: false }));
    }
  };

  const handleReject = async (venueId) => {
    setLoading(prev => ({ ...prev, [venueId]: true }));
    try {
      const response = await fetch(`/api/admin/venues/${venueId}/reject`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        onReject(venueId);
      }
    } catch (error) {
      console.error('Error rejecting venue:', error);
    } finally {
      setLoading(prev => ({ ...prev, [venueId]: false }));
    }
  };

  return (
    <section className="section-adminDashboard">
      <h3>Facility Approval Queue</h3>
      <div className="approval-list">
        {pendingVenues.length === 0 ? (
          <div className="empty-state">
            <p>No pending facilities for approval.</p>
          </div>
        ) : (
          pendingVenues.map((venue) => (
            <div className="approval-card" key={venue._id}>
              <div className="venue-image">
                {venue.photos?.[0] ? (
                  <img src={venue.photos[0]} alt={venue.name} />
                ) : (
                  <div className="placeholder">🏟️</div>
                )}
              </div>

              <div className="venue-details">
                <h4>{venue.name}</h4>
                <p className="venue-description">{venue.description}</p>
                <div className="venue-meta">
                  <p><strong>Owner:</strong> {venue.owner?.name || 'N/A'} ({venue.owner?.email || ''})</p>
                  <p><strong>Location:</strong> {venue.address?.street}, {venue.address?.city}, {venue.address?.state}</p>
                  <p><strong>Sports:</strong> {venue.sportTypes?.join(', ')}</p>
                  {venue.amenities && venue.amenities.length > 0 && (
                    <p><strong>Amenities:</strong> {venue.amenities.join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="approval-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(venue._id)}
                  disabled={loading[venue._id]}
                >
                  {loading[venue._id] ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(venue._id)}
                  disabled={loading[venue._id]}
                >
                  {loading[venue._id] ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
const UserManagementSection = UserManagement;
const ReportsSection = Reports;
const ProfileSection = AdminProfile;

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch admin profile data
        const adminData = await getUserProfile();
        if (adminData) {
          setAdmin(adminData);
        } else {
          // Fallback to localStorage
          setAdmin({ name: localStorage.getItem("name") || "Admin" });
        }

        // Fetch dashboard stats
        const res = await fetch("/api/dashboard/admin", { credentials: "include" });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.data);

        // Fetch pending venues
        const venuesRes = await fetch("/api/admin/venues/pending", { credentials: "include" });
        const venuesData = await venuesRes.json();
        setPendingVenues((venuesData.data || []).slice(0, 5));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        // Fallback to localStorage for admin data
        setAdmin({ name: localStorage.getItem("name") || "Admin" });
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
  const handleApproveFacilities = () => navigate("/admin-dashboard/facility-approvals");

  const handleApproveVenue = (venueId) => {
    setPendingVenues(prev => prev.filter(venue => venue._id !== venueId));
  };

  const handleRejectVenue = (venueId) => {
    setPendingVenues(prev => prev.filter(venue => venue._id !== venueId));
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") navigate("/login");
  }, [navigate]);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 8, 15, 22],
        backgroundColor: "#ff7043",
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Booking Activity Over Time' },
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Bookings' }, beginAtZero: true },
    },
  };

  if (loading) return <div className="section-adminDashboard">Loading...</div>;
  if (error) return <div className="section-adminDashboard" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="admin-dashboard">
      <HeaderAdmin
        adminName={admin?.name || "Admin"}
        adminProfilePic={admin?.profilePic}
        onToggleSidebar={toggleSidebar}
      />
      <div className="dashboard__main">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
          role="Admin"
          userName={admin?.name || "Admin"}
          userAvatar={"🧑‍💼"}
          userProfilePic={admin?.profilePic}
        />
        <main className="dashboard__content">
          <Routes>
            <Route path="" element={<DashboardSection stats={stats} chartData={chartData} chartOptions={chartOptions} />} />
            <Route path="facility-approvals" element={
              <FacilityApprovalsSection
                pendingVenues={pendingVenues}
                onApprove={handleApproveVenue}
                onReject={handleRejectVenue}
              />
            } />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="user-management" element={<UserManagementSection />} />
            <Route path="reports" element={<ReportsSection />} />
            <Route path="profile" element={<ProfileSection />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
