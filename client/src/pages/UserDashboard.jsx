import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderUser from "../components/dashboard/HeaderUser";
import "../CSS/userDashboard.css";
import "../CSS/Dashboard.css";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import Home from "./user/Home";
import Venues from "./user/Venues";
import MyBookings from "./user/MyBookings";
import Profile from "./user/Profile";

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "User") {
      navigate("/login");
      return;
    }

    // Fetch basic user info for header
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          // You can fetch user info here if needed
          setUser({ name: localStorage.getItem("userName") || "User" });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const handleNavClick = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <HeaderUser
        userName={user?.name || "User"}
        onToggleSidebar={toggleSidebar}
      />
      <div className="dashboard__main">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onNavClick={handleNavClick}
          role="User"
          userName={user?.name || "User"}
          userAvatar={"🏆"}
        />
        <main className="dashboard__content">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="venues" element={<Venues />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;