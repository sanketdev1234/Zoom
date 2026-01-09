import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const Navigate = useNavigate();
  const [meetings, setmeetings] = useState([]);
  const [isdelete, setisdelete] = useState(false);

  useEffect(() => {
    async function getAllMeetings() {
      try {
        const response = await axios.get("/meeting/all", { withCredentials: true });
        console.log(response.data);
        setmeetings(response.data);
        console.log("The total meetings are", response.data);
      } catch (err) {
        console.log("the error is ", err);
        // Navigate("/pagenotfound");
      }
    }
    getAllMeetings();
  }, [isdelete]);

  const handleDelete = async (meetid) => {
    try {
      const response = await axios.delete(`/meeting/${meetid}/delete`, { withCredentials: true });
      console.log(response);
      if (response.status == 401) {
        toast.error(`${response.data} ! only host can delete the meeting`);
      } else {
        toast.success("Meeting deleted successfully");
        setisdelete(!isdelete);
      }
    } catch (err) {
      console.log("the error is", err);
      toast.error("Failed to delete meeting");
    }
  }

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          background: #f3f2f0;
        }

        .dashboard-container {
          min-height: 100vh;
          background: #f3f2f0;
          padding: 24px;
        }

        .dashboard-content {
          max-width: 1128px;
          margin: 0 auto;
        }

        .dashboard-header {
          background: white;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #e0e0e0;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 600;
          color: #000000;
          margin: 0 0 8px 0;
        }

        .dashboard-subtitle {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
        }

        .meetings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 16px;
        }

        .meeting-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.2s ease;
        }

        .meeting-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .host-info {
          flex: 1;
        }

        .host-name {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 4px;
        }

        .meeting-id {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .info-row {
          margin-bottom: 12px;
        }

        .info-label {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 14px;
          color: #000000;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #0a66c2;
          color: white;
        }

        .btn-primary:hover {
          background: #004182;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #bb2d3b;
        }

        .empty-state {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }

        @media (max-width: 768px) {
          .meetings-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-container {
            padding: 16px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Meetings</h1>
            <p className="dashboard-subtitle">
              {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} total
            </p>
          </div>

          {/* Meetings Grid */}
          {meetings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-title">No meetings found</div>
              <div className="empty-text">Your attended meetings will appear here</div>
            </div>
          ) : (
            <div className="meetings-grid">
              {meetings.map((meeting) => {
                const startTime = formatDateTime(meeting.StartAt);
                const endTime = formatDateTime(meeting.EndAt);

                return (
                  <div key={meeting._id} className="meeting-card">
                    {/* Header */}
                    <div className="card-header">
                      <div className="host-info">
                        <div className="host-name">
                          {meeting.Hosted_by?.display_name || 'Unknown Host'}
                        </div>
                        <div className="meeting-id">
                          Meeting ID: {meeting.Joining_id}
                        </div>
                      </div>
                    </div>

                    {/* Meeting Info */}
                    <div className="info-row">
                      <div className="info-label">Start Time</div>
                      <div className="info-value">
                        {startTime.date} at {startTime.time}
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-label">End Time</div>
                      <div className="info-value">
                        {meeting.EndAt ? `${endTime.date} at ${endTime.time}` : 'Ongoing'}
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-label">Participants</div>
                      <div className="info-value">
                        {meeting.Participants?.length || 0} {meeting.Participants?.length === 1 ? 'member' : 'members'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="card-actions">
                      <Link 
                        to={`/meet/${meeting._id}/detail`} 
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDelete(meeting._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default UserDashboard;