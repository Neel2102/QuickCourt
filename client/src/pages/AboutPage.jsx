import { Link } from 'react-router-dom';
import '../CSS/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About QuickCourt</h1>
          <p className="hero-subtitle">
            Revolutionizing sports facility booking with seamless technology and exceptional user experience
          </p>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">🏟️</div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At QuickCourt, we believe that finding and booking sports facilities should be as easy as
              a few clicks. Our mission is to connect sports enthusiasts with the perfect venues while
              empowering facility owners to maximize their bookings and grow their business.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <h3>500+</h3>
                <p>Sports Facilities</p>
              </div>
              <div className="stat-item">
                <h3>10,000+</h3>
                <p>Happy Users</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Cities Covered</p>
              </div>
              <div className="stat-item">
                <h3>24/7</h3>
                <p>Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose QuickCourt?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Easy Discovery</h3>
              <p>Find sports facilities near you with advanced search filters for location, sport type, and amenities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Booking</h3>
              <p>Book your favorite courts instantly with real-time availability and secure payment processing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Compare prices across multiple venues and find the best deals for your budget.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access QuickCourt on any device with our responsive design and mobile-optimized experience.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Quality Assured</h3>
              <p>All facilities are verified and rated by our community to ensure the best experience.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community Driven</h3>
              <p>Join a community of sports enthusiasts and connect with players in your area.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            We're a passionate team of sports enthusiasts and technology experts dedicated to
            making sports more accessible for everyone.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>John Smith</h3>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">
                Former professional athlete turned tech entrepreneur with 10+ years in sports industry.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">
                Full-stack developer with expertise in building scalable platforms for sports and recreation.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍🎨</div>
              <h3>Mike Chen</h3>
              <p className="member-role">Head of Design</p>
              <p className="member-bio">
                UX/UI designer focused on creating intuitive and engaging user experiences.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h3>Emily Davis</h3>
              <p className="member-role">Head of Operations</p>
              <p className="member-bio">
                Operations expert ensuring smooth facility partnerships and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>🎯 Excellence</h3>
              <p>We strive for excellence in everything we do, from our platform to customer service.</p>
            </div>
            <div className="value-item">
              <h3>🤝 Trust</h3>
              <p>Building trust through transparency, reliability, and consistent quality experiences.</p>
            </div>
            <div className="value-item">
              <h3>🚀 Innovation</h3>
              <p>Continuously innovating to improve how people discover and book sports facilities.</p>
            </div>
            <div className="value-item">
              <h3>🌟 Community</h3>
              <p>Fostering a vibrant community of sports enthusiasts and facility owners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who have already discovered their perfect sports venue</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Sign Up Now
              </Link>
              <Link to="/venues" className="cta-btn secondary">
                Browse Venues
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;