import React, { useState, useEffect } from 'react';
import "../CSS/LandingPage.css";
import Navbar from '../components/Navbar';

const LandingPage = () => {
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
      title: 'Modern Design',
      description: 'Clean and contemporary interface that follows current design trends'
    },
    {
      title: 'Fast Performance',
      description: 'Optimized for speed with lightning-fast load times'
    },
    {
      title: 'Responsive Layout',
      description: 'Perfect experience across all devices and screen sizes'
    }
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
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Build Something</span>
              <span className="title-line title-highlight">Amazing Today</span>
            </h1>
            <p className="hero-description">
              Transform your ideas into reality with our cutting-edge solutions. 
              We create exceptional digital experiences that drive results and inspire action.
            </p>
            <div className="hero-actions">
              <button className="cta-primary">Get Started</button>
              <button className="cta-secondary">Learn More</button>
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

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              We deliver exceptional results through innovative solutions and dedicated service
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
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers who have transformed their business with our solutions
            </p>
            <button className="cta-button">Start Your Journey</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;