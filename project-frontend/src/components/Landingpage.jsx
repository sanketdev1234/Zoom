import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Shield, Briefcase, Globe, FileUser } from 'lucide-react'; // Swapped icons to match professional theme
import VideoCallingNavbar from "./ResizableNavbar";
import axios from 'axios';
import { Link } from "react-router-dom";

const SanketMeetLanding = () => {
  const [user, setuser] = useState("");

  useEffect(() => {
    async function checkuser() {
      await axios.get("/auth/authstatus", { withCredentials: true }).then((response) => {
        setuser(response.data.user.display_name);
      }).catch((err) => {
        console.log("the error is ", err);
      });
    }
    checkuser();
  }, []);

  const features = [
    {
      id: 'professional-profile',
      icon: FileUser,
      title: 'Professional Identity',
      description: 'Create a comprehensive digital resume. Showcase your work experience, education history, and key skills to the professional world.'
    },
    {
      id: 'real-time-networking',
      icon: Users,
      title: 'Expand Your Network',
      description: 'Find and connect with industry peers, colleagues, and mentors. Build meaningful professional relationships that drive career growth.'
    },
    {
      id: 'secure-authentication',
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade JWT authentication and secure handling of professional credentials.'
    },
    {
      id: 'knowledge-feed',
      icon: Globe,
      title: 'Global Insights',
      description: 'Stay updated with a personalized feed. Share professional updates, articles, and engage with the community through posts.'
    },
    {
      id: 'instant-messaging',
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Collaborate instantly with integrated chat functionality. Discuss opportunities and share ideas in real-time with your connections.'
    },
    {
      id: 'career-opportunities',
      icon: Briefcase,
      title: 'Career Evolution',
      description: 'Leverage your professional graph to discover new opportunities and track your growth within your industry niche.'
    }
  ];

  return (
    <>
      <VideoCallingNavbar />
      
      <style>{`
        * {
          cursor: auto;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          background: #f3f2f0;
        }

        .landing-container {
          background: #f3f2f0;
          min-height: 100vh;
        }

        .hero-section {
          background: white;
          padding: 80px 0 60px;
        }

        .hero-content {
          max-width: 1128px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 400;
          color: #000000;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }

        .cta-button {
          background: #181919ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s ease;
        }

        .cta-button:hover {
          background: #004182;
          color: white;
        }

        .features-section {
          background: #f3f2f0;
          padding: 60px 0;
        }

        .features-container {
          max-width: 1128px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 400;
          color: #000000;
          text-align: center;
          margin-bottom: 48px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: white;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          transition: box-shadow 0.2s ease;
        }

        .feature-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #141415ff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 8px;
        }

        .feature-description {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .section-title {
            font-size: 28px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="landing-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to your professional community
            </h1>
            <p className="hero-subtitle">
              Connect with colleagues, showcase your professional journey, and discover your next big opportunity. 
              Join a network designed for meaningful professional growth.
            </p>
            {user ? (
              <Link className="cta-button" to="/dashboard">
                Welcome back, {user} - Go to Dashboard
              </Link>
            ) : (
              <Link className="cta-button" to="/signup">
                Get Started for Free
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section" id="features">
          <div className="features-container">
            <h2 className="section-title">
              Designed for the modern professional
            </h2>
            
            <div className="features-grid">
              {features.map((feature) => (
                <div key={feature.id} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <feature.icon color="white" size={24} />
                  </div>
                  <h3 className="feature-title">
                    {feature.title}
                  </h3>
                  <p className="feature-description">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SanketMeetLanding;