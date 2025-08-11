import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderAdmin from "../components/dashboard/HeaderAdmin";
import "../CSS/adminDashboard.css";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
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

const FacilityApprovalsSection = ({ pendingVenues }) => (
  <section className="section-adminDashboard">
    <h3>Facility Approval Queue</h3>
    <div className="approval-list">
      {pendingVenues.length === 0 ? (
        <p>No pending facilities.</p>
      ) : (
        pendingVenues.map((venue) => (
          <div className="approval-card" key={venue._id}>
            <div><b>{venue.name}</b> ({venue.sportTypes?.join(', ')})</div>
            <div>Owner: {venue.owner?.fullName || 'N/A'} ({venue.owner?.email || ''})</div>
            <div>Location: {venue.address?.city || ''}</div>
          </div>
        ))
      )}
    </div>
  </section>
);
const UserManagementSection = () => <section className="section-adminDashboard"><h3>User Management</h3><p>User management UI here.</p></section>;
const ReportsSection = () => <section className="section-adminDashboard"><h3>Reports & Moderation</h3><p>Reports and moderation UI here.</p></section>;
const ProfileSection = () => <section className="section-adminDashboard"><h3>Profile</h3><p>Profile UI here.</p></section>;

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
        const adminName = localStorage.getItem("name") || "Admin";
        setAdmin({ name: adminName });
        const res = await fetch("/api/dashboard/admin", { credentials: "include" });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.data);
        const venuesRes = await fetch("/api/admin/venues/pending", { credentials: "include" });
        const venuesData = await venuesRes.json();
        setPendingVenues((venuesData.data || []).slice(0, 5));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
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
      <HeaderAdmin adminName={admin?.name || "Admin"} onApproveFacilities={handleApproveFacilities} />
      <div className="dashboard__main">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
          role="Admin"
          userName={admin?.name || "Admin"}
          userAvatar={"🧑‍💼"}
        />
        <main className="dashboard__content">
          <Routes>
            <Route path="" element={<DashboardSection stats={stats} chartData={chartData} chartOptions={chartOptions} />} />
            <Route path="facility-approvals" element={<FacilityApprovalsSection pendingVenues={pendingVenues} />} />
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
