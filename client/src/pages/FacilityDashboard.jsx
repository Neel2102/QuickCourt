import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderFacility from "../components/dashboard/HeaderFacility";
import "../CSS/facilityDashboard.css";
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
  <section className="section-facilityDashboard">
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

const ManageFacilitiesSection = () => <section className="section-facilityDashboard"><h3>Manage Facilities</h3><p>Facility management UI here.</p></section>;
const ManageCourtsSection = () => <section className="section-facilityDashboard"><h3>Manage Courts</h3><p>Court management UI here.</p></section>;
const TimeSlotsSection = () => <section className="section-facilityDashboard"><h3>Time Slots</h3><p>Time slot management UI here.</p></section>;
const BookingsOverviewSection = () => <section className="section-facilityDashboard"><h3>Bookings Overview</h3><p>Bookings overview UI here.</p></section>;
const ProfileSection = () => <section className="section-facilityDashboard"><h3>Profile</h3><p>Profile UI here.</p></section>;

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
        const ownerName = localStorage.getItem("name") || "Owner";
        setOwner({ name: ownerName });
        const res = await fetch("/api/dashboard/owner", { credentials: "include" });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.data);
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
  const handleAddFacility = () => navigate("/facility-dashboard/manage-facilities");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "FacilityOwner") navigate("/login");
  }, [navigate]);

  if (loading) return <div className="section-facilityDashboard">Loading...</div>;
  if (error) return <div className="section-facilityDashboard" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="facility-dashboard">
      <HeaderFacility ownerName={owner?.name || "Owner"} onAddFacility={handleAddFacility} />
      <div className="dashboard__main">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
          role="FacilityOwner"
          userName={owner?.name || "Owner"}
          userAvatar={"🏟️"}
        />
        <main className="dashboard__content">
          <Routes>
            <Route path="" element={<DashboardSection stats={stats} />} />
            <Route path="manage-facilities" element={<ManageFacilitiesSection />} />
            <Route path="manage-courts" element={<ManageCourtsSection />} />
            <Route path="time-slots" element={<TimeSlotsSection />} />
            <Route path="bookings-overview" element={<BookingsOverviewSection />} />
            <Route path="profile" element={<ProfileSection />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default FacilityDashboard;
