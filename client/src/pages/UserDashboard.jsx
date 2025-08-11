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
import UserReviews from "./user/UserReviews";
import { getUserProfile } from "../services/userService";
import VenueDetailsPage from "./VenueDetailsPage.jsx";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/auth/LogoutButton";

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch user profile data
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserProfile();
        if (userData) {
          setUser(userData);
        } else {
          // Fallback to auth user data
          setUser({
            name: authUser?.name || "User",
            email: authUser?.email || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Fallback to auth user data
        setUser({
          name: authUser?.name || "User",
          email: authUser?.email || ""
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && authUser) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, authUser]);

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
        userProfilePic={user?.profilePic}
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
          userProfilePic={user?.profilePic}
        />
        <main className="dashboard__content">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="venues" element={<Venues />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="my-reviews" element={<UserReviews />} />
            <Route path="profile" element={<Profile />} />
            <Route path='venue/:id' element={<VenueDetailsPage/>}/>
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;