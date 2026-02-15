import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  const fetchIncomingRequests = async () => {
    try {
      const response = await axios.get('/connection/newincomingrequest');
      console.log("incoming requests:", response.data.requests);
      setRequests(response.data.requests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      const response = await axios.get(`/connection/acceptconnection/${userId}`);
      if (response.status === 200) {
        setRequests(requests.filter(req => req.sender._id !== userId));
        
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      
    }
  };

  const handleDecline = async (userId) => {
    try {
      const response = await axios.delete(`/connection/declineconnection/${userId}`);
      if (response.status === 200) {
        setRequests(requests.filter(req => req.sender._id !== userId));
        
      }
    } catch (error) {
      console.error('Error declining connection:', error);
     
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading requests...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Connection Requests</h1>
          <p style={styles.subtitle}>
            {requests.length} {requests.length === 1 ? 'pending request' : 'pending requests'}
          </p>
        </div>

        {requests.length === 0 ? (
          <div style={styles.noRequests}>
            <p style={styles.noRequestsText}>No pending connection requests</p>
          </div>
        ) : (
          <div style={styles.requestsList}>
            {requests.map((req) => (
              <div key={req.sender._id} style={styles.requestCard}>
                
                <div style={styles.userInfo}>
                  <div style={styles.profilePicture}>
                    <img
                      src={req.sender.profile_picture.url}
                      alt={req.sender.display_name}
                      style={styles.profileImage}
                    />
                  </div>

                  <div style={styles.userDetails}>
                    <h3 style={styles.displayName}>{req.sender.display_name}</h3>
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  <button
                    onClick={() => handleAccept(req.sender._id)}
                    style={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req.sender._id)}
                    style={styles.declineButton}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f2ef',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  wrapper: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 10px'
  },
  loadingText: {
    fontSize: '18px',
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  noRequests: {
    backgroundColor: '#ffffff',
    padding: '60px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  },
  noRequestsText: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: '250px'
  },
  profilePicture: {
    width: '72px',
    height: '72px',
    flexShrink: 0
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e0e0e0'
  },
  userDetails: {
    flex: 1,
    minWidth: 0
  },
  displayName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 6px 0'
  },
  headline: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 6px 0'
  },
  location: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    flexShrink: 0,
    flexWrap: 'wrap'
  },
  acceptButton: {
    padding: '10px 24px',
    backgroundColor: '#0a66c2',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  declineButton: {
    padding: '10px 24px',
    backgroundColor: '#ffffff',
    border: '1px solid #d32f2f',
    borderRadius: '20px',
    color: '#d32f2f',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  }
};