import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './usercontext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { curruser, setCurruser } = useContext(UserContext);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // On desktop, keep sidebar open by default
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    setCurruser(null);
    localStorage.removeItem('token');
    navigate('/login');
    closeSidebar();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed/${searchQuery.trim()}`);
      setSearchQuery('');
      closeSidebar();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/feed', label: 'Feed', icon: '📰' },
    { path: '/myconnections', label: 'My Connections', icon: '👥' },
    { path: '/incomingrequests', label: 'Requests', icon: '📬' },
    { path: '/createpost', label: 'Create Post', icon: '✍️' },
    { path: '/newmeet', label: 'Create Meeting', icon: '📹' },
    { path: '/joinmeet', label: 'Join Meeting', icon: '🔗' },
    { path: `/getprofile/${curruser?._id}`, label: 'My Profile', icon: '👤' },
    { path: `/updateprofile/${curruser?._id}/${curruser?.profileId || 'profile'}`, label: 'Edit Profile', icon: '✏️' },
  ];

  const SidebarContent = ({ showCloseButton = false }) => (
    <>
      <div style={styles.sidebarHeader}>
        <h2 style={styles.logo}>ConnectHub</h2>
        <button
          onClick={closeSidebar}
          style={styles.closeButton}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {curruser && (
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {curruser.profile_picture?.url ? (
              <img
                src={curruser.profile_picture.url}
                alt={curruser.display_name}
                style={styles.avatarImage}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {curruser.display_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={styles.userDetails}>
            <p style={styles.userName}>{curruser.display_name}</p>
            <p style={styles.userEmail}>{curruser.email}</p>
          </div>
        </div>
      )}

      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search user posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍
          </button>
        </form>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={showCloseButton ? closeSidebar : undefined}
            style={{
              ...styles.navLink,
              ...(isActive(item.path) ? styles.navLinkActive : {})
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <span style={styles.navIcon}>🚪</span>
          <span style={styles.navLabel}>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Button - Visible on mobile and desktop */}
      <button
        onClick={toggleSidebar}
        style={{
          ...styles.hamburger,
          display: isMobile || !isOpen ? 'flex' : 'none'
        }}
        aria-label="Toggle menu"
      >
        <span style={styles.hamburgerLine}></span>
        <span style={styles.hamburgerLine}></span>
        <span style={styles.hamburgerLine}></span>
      </button>

      {/* Overlay - Only on mobile when open */}
      {isMobile && isOpen && (
        <div style={styles.overlay} onClick={closeSidebar}></div>
      )}

      {/* Desktop Sidebar - Always visible on desktop */}
      {!isMobile && (
        <aside style={{
          ...styles.desktopSidebar,
          transform: isOpen ? 'translateX(0)' : 'translateX(-280px)'
        }}>
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar - Slides in on mobile */}
      {isMobile && (
        <aside
          style={{
            ...styles.mobileSidebar,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
        >
          <SidebarContent showCloseButton={true} />
        </aside>
      )}
    </>
  );
}

const styles = {
  hamburger: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1100,
    width: '40px',
    height: '40px',
    backgroundColor: '#0a66c2',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    padding: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  hamburgerLine: {
    width: '24px',
    height: '3px',
    backgroundColor: '#ffffff',
    borderRadius: '2px'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1200
  },
  desktopSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    transition: 'transform 0.3s ease-in-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  mobileSidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0a66c2',
    margin: 0
  },
  closeButton: {
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px'
  },
  userInfo: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    flexShrink: 0
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#0a66c2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600'
  },
  userDetails: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  userEmail: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  searchContainer: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  searchForm: {
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  searchButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px'
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: '#333',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  },
  navLinkActive: {
    backgroundColor: '#e7f3ff',
    color: '#0a66c2',
    borderLeft: '3px solid #0a66c2'
  },
  navIcon: {
    fontSize: '20px',
    width: '24px',
    textAlign: 'center'
  },
  navLabel: {
    flex: 1
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #e0e0e0'
  },
  logoutButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #d32f2f',
    borderRadius: '6px',
    color: '#d32f2f',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};