import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Box } from "@mui/material";
import { deepPurple } from '@mui/material/colors';
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VideoCallingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setuser] = useState();
  const Navigate = useNavigate();

  useEffect(() => {
    async function checkuser() {
      await axios.get("/auth/authstatus", { withCredentials: true }).then((response) => {
        console.log("the response is ", response.data);
        setuser(response.data.user.display_name);
        console.log(user);
      }).catch((err) => {
        console.log("the error is ", err);
      });
    }
    checkuser();
  }, [user]);

  const handlelogout = async () => {
    await axios.get("/auth/logout", { withCredentials: true }).then((response) => {
      console.log(response.data);
      toast.success("Logout successful!");
      setuser("");
      Navigate("/landingpage");
    })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <style>{`
        .linkedin-navbar {
          background: white;
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1128px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #131414ff;
          font-weight: 600;
          font-size: 20px;
          gap: 8px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #181819ff;
          color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .navbar-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          text-decoration: none;
          color: #666;
          font-size: 18px;
          font-weight: 400;
          border-radius: 4px;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
        }

        .nav-item:hover {
          background: #f3f2f0;
          color: #000;
        }

        .nav-item i {
          font-size: 20px;
          margin-bottom: 2px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-linkedin {
          padding: 8px 16px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: #0f0f0fff;
          color: white;
        }

        .btn-primary:hover {
          background: #004182;
        }

        .btn-outline {
          background: white;
          color: #141414ff;
          border: 1px solid #09090aff;
        }

        .btn-outline:hover {
          background: #e8f3fc;
        }

        .user-avatar {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .user-avatar:hover {
          opacity: 0.8;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }

        .mobile-toggle i {
          font-size: 24px;
          color: #666;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu.active {
          display: block;
        }

        .mobile-menu-content {
          max-width: 1128px;
          margin: 0 auto;
          padding: 16px 24px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 8px;
          text-decoration: none;
          color: #666;
          font-size: 14px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .mobile-nav-item:hover {
          background: #f3f2f0;
          color: #000;
        }

        .mobile-nav-item i {
          font-size: 20px;
        }

        .mobile-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 12px 0;
        }

        .mobile-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .navbar-center {
            display: none;
          }

          .navbar-right {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .navbar-container {
            padding: 0 16px;
          }
        }
      `}</style>

      <nav className="linkedin-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">
                <i class="fa-brands fa-staylinked"></i>
              </div>
              <span className="d-none d-sm-inline">S-Connect</span>
            </Link>
          </div>

          <div className="navbar-center">
            <a href="#features" className="nav-item">
              <span>Features</span>
            </a>

            <Box className="nav-item" sx={{ cursor: 'default' }}>
              {user ? (
                <Avatar 
                  sx={{ 
                    bgcolor: deepPurple[500],
                    width: 24,
                    height: 24,
                    fontSize: '12px'
                  }}
                >
                  {user.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar 
                  sx={{ 
                    bgcolor: '#f3f4f6',
                    color: '#666',
                    width: 24,
                    height: 24
                  }}
                >
                  <i className="fa-solid fa-user" style={{ fontSize: '12px' }}></i>
                </Avatar>
              )}
              
            </Box>

            <a href="/contact" className="nav-item">
              <span>Contact</span>
            </a>
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                <Link to="/newmeet" className="btn-linkedin btn-outline">
                  New Meet
                </Link>
                <Link to="/joinmeet" className="btn-linkedin btn-outline">
                  Join Meet
                </Link>
                <button className="btn-linkedin btn-primary" onClick={handlelogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-linkedin btn-outline">
                  Log In
                </Link>
                <Link to="/signup" className="btn-linkedin btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            Open
          </button>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <a href="#features" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Features</span>
            </a>

            <Box className="mobile-nav-item">
              {user ? (
                <Avatar 
                  sx={{ 
                    bgcolor: deepPurple[500],
                    width: 32,
                    height: 32,
                    fontSize: '14px'
                  }}
                >
                  {user.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar 
                  sx={{ 
                    bgcolor: '#f3f4f6',
                    color: '#666',
                    width: 32,
                    height: 32
                  }}
                >
                  <i className="fa-solid fa-user" style={{ fontSize: '14px' }}></i>
                </Avatar>
              )}
              <span>{user ? user : 'Guest'}</span>
            </Box>

            <a href="/contact" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            
              <span>Contact</span>
            </a>

            <div className="mobile-divider"></div>

            <div className="mobile-buttons">
              {user ? (
                <>
                  <Link to="/newmeet" className="btn-linkedin btn-outline" onClick={() => setIsMobileMenuOpen(false)}>
                    Create New Meet
                  </Link>
                  <Link to="/joinmeet" className="btn-linkedin btn-outline" onClick={() => setIsMobileMenuOpen(false)}>
                    Join Meet
                  </Link>
                  <button className="btn-linkedin btn-primary" onClick={() => { handlelogout(); setIsMobileMenuOpen(false); }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-linkedin btn-outline" onClick={() => setIsMobileMenuOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/signup" className="btn-linkedin btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}




