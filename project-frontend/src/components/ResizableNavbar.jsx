import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Box } from "@mui/material";
import { deepPurple} from '@mui/material/colors';
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VideoCallingNavbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const[user,setuser]=useState();
  const Navigate=useNavigate();
  const isScrolled = scrollY > 50;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
    
  useEffect(()=>{
    async function checkuser(){
    await axios.get("/auth/authstatus",{withCredentials: true}).then((response)=>{
    console.log("the response is ", response.data);
    setuser(response.data.display_name);
    console.log(user);

    }).catch((err)=>{
      console.log("the error is ",err);
      Navigate("/pagenotfound")
    });
    }
    checkuser();
  },[user]);
    
  const handlelogout=async ()=>{
    await axios.get("/auth/logout",{withCredentials:true}).then((response)=>{
      console.log(response.data);
      toast.success("logout done!");
      setuser("");
      Navigate("/landingpage");
    })
  }
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
const navLinks = [
  { name: "Features", href: "#features", icon: "bi-star" },
  { name: "Contact", href: "#contact", icon: "bi-envelope" },
];
  return (
    <>
      
      <style>{`
        .navbar-custom {
          backdrop-filter: ${isScrolled ? 'blur(20px)' : 'blur(5px)'};
          background: ${isScrolled 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
          };
          border: ${isScrolled ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(226, 232, 240, 0.8)'};
          box-shadow: ${isScrolled 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          };
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: ${isScrolled ? 'scale(0.98)' : 'scale(1)'};
        }

        .navbar-brand-custom {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .navbar-brand-custom:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }

        .nav-link-custom {
          color: #374151;
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          position: relative;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 0.25rem;
        }

        .nav-link-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 0.75rem;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .nav-link-custom:hover {
          color: white;
          transform: translateY(-2px);
        }

        .nav-link-custom:hover::before {
          opacity: 1;
        }

        .nav-link-custom i {
          position: relative;
          z-index: 1;
          margin-right: 0.5rem;
        }

        .nav-link-custom span {
          position: relative;
          z-index: 1;
        }

        .btn-custom {
          border: none;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
        }

        .btn-login {
          background: transparent;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .btn-login:hover {
          background: #f9fafb;
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-2px);
        }

        .btn-call {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
        }

        .btn-call::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-call:hover::before {
          opacity: 1;
        }

        .btn-call:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.5);
        }

        .btn-call i,
        .btn-call span {
          position: relative;
          z-index: 1;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 1rem;
          margin-top: 0.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: ${isMobileMenuOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'};
          opacity: ${isMobileMenuOpen ? '1' : '0'};
          visibility: ${isMobileMenuOpen ? 'visible' : 'hidden'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-nav-link {
          display: block;
          padding: 1rem 1.5rem;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          border-radius: 0.75rem;
          margin: 0.25rem;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          transform: translateX(8px);
        }

        .hamburger {
          width: 24px;
          height: 24px;
          position: relative;
          cursor: pointer;
        }

        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: #374151;
          margin: 5px 0;
          transition: all 0.3s ease;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin-right: 0.75rem;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          transition: all 0.3s ease;
        }

        .logo-icon:hover {
          transform: rotate(5deg) scale(1.05);
        }

        @media (max-width: 991.98px) {
          .navbar-custom {
            width: ${isScrolled ? '95%' : '100%'} !important;
            border-radius: ${isScrolled ? '1rem' : '0.75rem'};
          }
        }
      `}</style>

      {/* Desktop Navbar */}
      <nav 
        className={`navbar navbar-expand-lg position-sticky top-0 mx-auto navbar-custom ${
          isScrolled ? 'mt-3' : 'mt-4'
        } d-none d-lg-block`}
        style={{ 
          maxWidth: '1000px', 
          width: isScrolled ? '95%' : '100%',
          borderRadius: '1.25rem',
          zIndex: 1000
        }}
      >
        <div className="container-fluid px-4">
          {/* Brand */}
          <a href="#" className="d-flex align-items-center text-decoration-none navbar-brand-custom">
            <div className="logo-icon">
            <i className="fa-solid fa-camera"></i>
            </div>
            <span>VideoConnect</span>
          </a>

          {/* Center Navigation */}
          <div className="d-flex justify-content-center flex-grow-1">
            <div className="d-flex align-items-center gap-3">
              {/* Features Link */}
              <a
                href="#features"
                className="nav-link-custom"
              >
                <i className="bi-star"></i>
                <span>Features</span>
              </a>
              
              {/* User Avatar in Middle */}
              <Box display="flex" alignItems="center" sx={{ mx: 2 }}>
                {user ? (
                  <Avatar 
                    sx={{ 
                      bgcolor: deepPurple[500],
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                      }
                    }}
                  >
                    {user.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <Avatar 
                    sx={{ 
                      bgcolor: '#f3f4f6',
                      color: '#6b7280',
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '2px solid #e5e7eb',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
                        bgcolor: '#e5e7eb',
                        color: '#374151'
                      }
                    }}
                  >
                      <i className="fa-solid fa-user" style={{ fontSize: '1.5rem' }}></i>
                  </Avatar>
                )}
              </Box>
              
              {/* Contact Link */}
              <a
                href="/contact"
                className="nav-link-custom"
              >
                <i className="bi-envelope"></i>
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Right Buttons */}
          {user ? (
            <div className="d-flex gap-3 align-items-center">
              <button className="btn btn-custom btn-login" onClick={handlelogout}>
                <i className="bi bi-person me-2"></i>
                Logout
              </button>
              <button className="btn btn-custom btn-call">
                <Link to="/newmeet" className="btn btn-custom btn-login" style={{ textDecoration: 'none' }}>
                  Create New Meet
                </Link>
              </button>
            </div>
          ) : (
            <div className="d-flex gap-3 align-items-center">
              <Link to="/signup" className="btn btn-custom btn-login" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-custom btn-login" style={{ textDecoration: 'none' }}>
                Log In
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav 
        className={`navbar position-sticky top-0 mx-auto navbar-custom ${
          isScrolled ? 'mt-3' : 'mt-4'
        } d-lg-none`}
        style={{ 
          width: isScrolled ? '95%' : '100%',
          borderRadius: isScrolled ? '1rem' : '0.75rem',
          zIndex: 1000
        }}
      >
        <div className="container-fluid px-3 position-relative">
          {/* Mobile Brand */}
          <a href="#" className="d-flex align-items-center text-decoration-none navbar-brand-custom">
            <div className="logo-icon">
              <i className="bi bi-camera-video-fill"></i>
            </div>
            <span>VideoConnect</span>
          </a>

          {/* Mobile Toggle */}
          <button 
            className="btn p-0 border-0 bg-transparent"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Mobile Menu */}
          <div className="mobile-menu">
            <div className="p-3">
              {/* Features Link */}
              <a
                href="#features"
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="bi-star me-3"></i>
                Features
              </a>
              
              {/* Mobile User Avatar in Middle */}
              <div className="d-flex justify-content-center my-3">
                <Box display="flex" alignItems="center">
                  {user ? (
                    <Avatar 
                      sx={{ 
                        bgcolor: deepPurple[500],
                        width: 50,
                        height: 50,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                        }
                      }}
                    >
                      {user.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <Avatar 
                      sx={{ 
                        bgcolor: '#f3f4f6',
                        color: '#6b7280',
                        width: 50,
                        height: 50,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid #e5e7eb',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
                          bgcolor: '#e5e7eb',
                          color: '#374151'
                        }
                      }}
                    >
                      <i className="fa-solid fa-user" style={{ fontSize: '1.5rem' }}></i>
                    </Avatar>
                  )}
                </Box>
              </div>
              
              {/* Contact Link */}
              <a
                href="/contact"
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="bi-envelope me-3"></i>
                Contact
              </a>
              
              <hr className="my-3 opacity-25" />
              {user ? 
              (<div className="d-grid gap-3">
                <button className="btn btn-custom btn-login" onClick={handlelogout}>
                  <i className="bi bi-person me-2"></i>
                  Log out
                </button>
                <button className="btn btn-custom btn-call">
                <Link to="/newmeet" className="btn btn-custom btn-login" style={{ textDecoration: 'none' }}>
                  Create New Meet
                </Link>
                </button>
              </div>):(<div className="d-grid gap-3">
                <Link to="/signup" className="btn btn-custom btn-login" style={{ textDecoration: 'none' }}>
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-custom btn-login" style={{ textDecoration: 'none' }}>
                  Log In
                </Link>
              </div>)
}
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}