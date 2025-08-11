import React, { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderUser from "../components/dashboard/HeaderUser";
import "../CSS/userDashboard.css";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";

const HomeSection = ({ user, bookings }) => (
  <section className="section-userDashboard">
    <h2>Welcome, {user?.name || "User"}!</h2>
    <p>You have <b>{bookings.filter(b => b.status === 'Confirmed').length}</b> upcoming bookings.</p>
  </section>
);

const VenuesSection = ({ venues }) => (
  <section className="section-userDashboard">
    <h3>Popular Venues</h3>
    <div className="venue-list">
      {venues.length === 0 ? (
        <p>No venues found.</p>
      ) : (
        venues.map((venue) => (
          <div className="venue-card" key={venue._id}>
            <div className="venue-photo">
              <img src={venue.photos?.[0] || '/default-venue.jpg'} alt={venue.name} style={{ width: 80, height: 80, borderRadius: 8 }} />
            </div>
            <div className="venue-info">
              <h4>{venue.name}</h4>
              <p>{venue.sportTypes?.join(', ')}</p>
              <p>From ₹{venue.startingPrice || 'N/A'} /hr</p>
              <p>{venue.address?.city || ''}</p>
              <p>⭐ {venue.rating || 0} ({venue.numberOfReviews || 0} reviews)</p>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
);

const BookingsSection = ({ bookings }) => (
  <section className="section-userDashboard">
    <h3>My Bookings</h3>
    <div className="booking-list">
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.slice(0, 3).map((booking) => (
          <div className="booking-card" key={booking._id}>
            <div>
              <b>{booking.venue?.name}</b> - {booking.court?.sportType}
            </div>
            <div>
              {new Date(booking.date).toLocaleDateString()} {booking.startTime} - {booking.endTime}
            </div>
            <div>Status: {booking.status}</div>
          </div>
        ))
      )}
    </div>
  </section>
);

const ProfileSection = ({ user }) => (
  <section className="section-userDashboard">
    <h3>Profile</h3>
    <div>Name: {user?.name}</div>
    {/* Add more profile info and edit functionality as needed */}
  </section>
);

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch user info (assume userId is in localStorage or context)
        const userId = localStorage.getItem("userId");
        const userRes = await fetch(`/api/user/data?userId=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const userData = await userRes.json();
        if (!userData.success) throw new Error(userData.message || "User fetch failed");
        setUser(userData.userData);
        const bookingsRes = await fetch("/api/bookings/mybookings", { credentials: "include" });
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.data || []);
        const venuesRes = await fetch("/api/venues/", { credentials: "include" });
        const venuesData = await venuesRes.json();
        setVenues((venuesData.data || []).slice(0, 3));
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
  const handleBookCourt = () => navigate("/venues");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "User") navigate("/login");
  }, [navigate]);

  if (loading) return <div className="section-userDashboard">Loading...</div>;
  if (error) return <div className="section-userDashboard" style={{ color: 'red' }}>{error}</div>;

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
            <Route path="" element={<HomeSection user={user} bookings={bookings} />} />
            <Route path="venues" element={<VenuesSection venues={venues} />} />
            <Route path="my-bookings" element={<BookingsSection bookings={bookings} />} />
            <Route path="profile" element={<ProfileSection user={user} />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;