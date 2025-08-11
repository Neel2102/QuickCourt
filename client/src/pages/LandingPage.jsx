import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/LandingPage.css";
import Navbar from '../components/Navbar';
import bgVideo from '../assets/Screen Recording 2025-08-07 175941.mp4';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      title: 'Easy Booking',
      description: 'Book your favorite sports facilities in just a few clicks with instant confirmation'
    },
    {
      title: 'Local Venues',
      description: 'Discover and book courts, turfs, and sports facilities near you'
    },
    {
      title: 'Community Sports',
      description: 'Join matches, create teams, and connect with fellow sports enthusiasts'
    }
  ];

  const popularSports = [
    { name: 'Badminton', icon: '🏸' },
    { name: 'Football', icon: '⚽' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Cricket', icon: '🏏' },
    { name: 'Table Tennis', icon: '🏓' }
  ];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="background-animation">
        <div 
          className="floating-element floating-element-1"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="floating-element floating-element-2"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        ></div>
        <div 
          className="floating-element floating-element-3"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'hero-visible' : ''}`}>
        <div className="hero-container">
          <video
            className="hero-bg-video"
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Book Your</span>
              <span className="title-line title-highlight">Perfect Court</span>
            </h1>
            <p className="hero-description">
              Discover and book local sports facilities instantly. Join matches, create teams, 
              and stay active with QuickCourt - your local sports community.
            </p>
            <div className="hero-actions">
              <button className="cta-primary" onClick={() => navigate('/venues')}>Find Venues</button>
              <button className="cta-secondary">Join Match</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="card-header"></div>
              <div className="card-content">
                <div className="card-line"></div>
                <div className="card-line short"></div>
                <div className="card-line medium"></div>
              </div>
            </div>
            <div className="visual-card card-2">
              <div className="card-icon"></div>
              <div className="card-stats">
                <div className="stat-item">
                  {/* <div className="stat-value">98%</div>
                  <div className="stat-label">Success Rate</div> */}
                </div>
              </div>
            </div>
            <div className="visual-card card-3">
              <div className="card-chart">
                <div className="chart-bar bar-1"></div>
                <div className="chart-bar bar-2"></div>
                <div className="chart-bar bar-3"></div>
                <div className="chart-bar bar-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports Section */}
      <section className="popular-sports-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Popular Sports</h2>
            <p className="section-subtitle">
              Find facilities for your favorite sports and activities
            </p>
          </div>
          <div className="sports-grid">
            {popularSports.map((sport, index) => (
              <div key={index} className="sport-card">
                <div className="sport-icon">{sport.icon}</div>
                <h3 className="sport-name">{sport.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose QuickCourt</h2>
            <p className="section-subtitle">
              The easiest way to book sports facilities and join the local sports community
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card feature-card-${index + 1}`}>
                <div className="feature-icon">
                  <div className="icon-shape"></div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Sports Venues</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Bookings Made</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Sports Types</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Play?</h2>
            <p className="cta-description">
              Join thousands of sports enthusiasts who book their perfect court with QuickCourt
            </p>
            <button className="cta-button">Start Booking Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;