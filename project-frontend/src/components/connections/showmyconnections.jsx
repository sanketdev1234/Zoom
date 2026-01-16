import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { UserContext } from "../usercontext";
import { useNavigate } from 'react-router-dom';
export default function MyConnections() {
  const navigate=useNavigate();
  const { curruser } = useContext(UserContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await axios.get('/connection/myconnections');
      console.log("the response in get connection", response.data.connections);
      setConnections(response.data.connections);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading connections...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Connections</h1>
          <p style={styles.subtitle}>
            {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
          </p>
        </div>

        {connections.length === 0 ? (
          <div style={styles.noConnections}>
            <p style={styles.noConnectionsText}>You have no connections yet</p>
          </div>
        ) : (
          <div style={styles.connectionsList}>
            {connections.map((connection) => (
              <div key={connection._id} style={styles.connectionCard}>
                
                <div style={styles.profilePicture}>
                  <img
                    src={connection.profile_picture.url}
                    alt={connection.display_name}
                    style={styles.profileImage}
                  />
                </div>

                <div style={styles.connectionInfo}>
                  <h3 style={styles.displayName}>{connection.display_name}</h3>
                </div>

                <div style={styles.actionSection}>
                  <button style={styles.viewProfileButton} onClick={()=>{navigate(`/getprofile/${connection._id}`)}}>
                    View Profile
                  </button>
                  <button style={styles.messageButton} onClick={()=>{navigate("/newmeet")}}>
                    Message
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
    maxWidth: '900px',
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
  noConnections: {
    backgroundColor: '#ffffff',
    padding: '60px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  },
  noConnectionsText: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  connectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  connectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
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
  connectionInfo: {
    flex: 1,
    minWidth: '200px'
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

  actionSection: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    flexWrap: 'wrap'
  },
  viewProfileButton: {
    padding: '8px 16px',
    backgroundColor: '#0a66c2',
    border: 'none',
    borderRadius: '16px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  messageButton: {
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #0a66c2',
    borderRadius: '16px',
    color: '#0a66c2',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  }
};