import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const UserDashboard = () => {
   const Navigate=useNavigate();
  const [meetings, setmeetings] = useState([  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isdelete,setisdelete]=useState(false);
  const [starsData, setStarsData] = useState({
    small: [],
    medium: [],
    big: []
  });

  
  useEffect(() => {
    async function getAllMeetings() {
      try {
        const response = await axios.get("/meeting/all", { withCredentials: true });
        console.log(response.data);
        setmeetings(response.data);
        console.log(typeof(meetings));
        console.log("The total meetings are", response.data);
      } catch (err) {
        console.log("the error is ",err);
        Navigate("/pagenotfound");
      }
    }
    getAllMeetings();
  }, [isdelete]);

  // Function to generate random box-shadows for stars
  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000
      });
    }
    return stars;
  };

  // Generate stars on component mount
  useEffect(() => {
    setStarsData({
      small: generateStars(700),
      medium: generateStars(200),
      big: generateStars(100)
    });
  }, []);

  const handleDelete=async (meetid)=>{
    try{
    const response=await axios.delete(`/meeting/${meetid}/delete`,{withCredentials:true});
    console.log(response);
    if(response.status==401){
      toast.error(`${response.data} ! only host can delete the meeting`);
    }
    else {
      toast.success("saved meeting history deleted");
      setisdelete(true);
    }
    }
    catch(err){
      console.log("the error is",err);
      Navigate("/pagenotfound")
    }
  }
  // Convert stars array to box-shadow string
  const createBoxShadow = (stars) => {
    return stars.map(star => `${star.x}px ${star.y}px #FFF`).join(', ');
  };

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

  // Slider navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(meetings.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(meetings.length / 3)) % Math.ceil(meetings.length / 3));
  };

  const styles = {
    container: {
      height: '100vh',
      background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
      overflow: "auto",
      position: 'relative',
      fontFamily: "'Lato', sans-serif"
    },
    stars: {
      width: '1px',
      height: '1px',
      background: 'transparent',
      boxShadow: starsData.small.length > 0 ? createBoxShadow(starsData.small) : '',
      animation: 'animStar 50s linear infinite',
      position: 'absolute'
    },
    stars2: {
      width: '2px',
      height: '2px',
      background: 'transparent',
      boxShadow: starsData.medium.length > 0 ? createBoxShadow(starsData.medium) : '',
      animation: 'animStar 100s linear infinite',
      position: 'absolute'
    },
    stars3: {
      width: '3px',
      height: '3px',
      background: 'transparent',
      boxShadow: starsData.big.length > 0 ? createBoxShadow(starsData.big) : '',
      animation: 'animStar 150s linear infinite',
      position: 'absolute'
    },
    title: {
      position: 'absolute',
      top: '15%',
      left: '0',
      right: '0',
      color: '#FFF',
      textAlign: 'center',
      fontFamily: "'Lato', sans-serif",
      fontWeight: '300',
      fontSize: 'clamp(24px, 6vw, 40px)',
      letterSpacing: '8px',
      marginTop: '-30px',
      paddingLeft: '10px',
      zIndex: 10
    },
    titleSpan: {
      background: 'linear-gradient(to bottom, white, #38495a)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'inline-block'
    },
    meetingsContainer: {
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      maxWidth: '1200px',
      zIndex: 10
    },
    sectionTitle: {
      color: '#FFF',
      fontSize: '28px',
      fontWeight: '300',
      textAlign: 'center',
      marginBottom: '30px',
      letterSpacing: '3px'
    },
    sliderContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px'
    },
    sliderWrapper: {
      display: 'flex',
      transition: 'transform 0.5s ease-in-out',
      transform: `translateX(-${currentSlide * 100}%)`
    },
    slide: {
      minWidth: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      padding: '0 20px'
    },
    meetingCard: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '15px',
      padding: '25px',
      color: '#FFF',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    cardGlow: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'linear-gradient(45deg, rgba(96, 165, 250, 0.1), rgba(139, 92, 246, 0.1))',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    },
    cardContent: {
      position: 'relative',
      zIndex: 2
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    hostedBy: {
      fontSize: '18px',
      fontWeight: '400',
      color: '#60a5fa'
    },
    meetingId: {
      fontSize: '12px',
      color: '#94a3b8',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '4px 8px',
      borderRadius: '6px'
    },
    timeSection: {
      marginBottom: '15px'
    },
    timeLabel: {
      fontSize: '14px',
      color: '#94a3b8',
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    timeValue: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#FFF'
    },
    status: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase'
    },
    statusEnded: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    statusActive: {
      background: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
      border: '1px solid rgba(34, 197, 94, 0.3)'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      color: '#FFF',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      transition: 'all 0.3s ease',
      zIndex: 10
    },
    prevButton: {
      left: '-25px'
    },
    nextButton: {
      right: '-25px'
    },
    emptyState: {
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '18px',
      padding: '60px 20px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  };

  const keyframes = `
    @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700');
    
    @keyframes animStar {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(-2000px);
      }
    }

    .meeting-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(96, 165, 250, 0.2);
    }

    .meeting-card:hover .card-glow {
      opacity: 1;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1.1);
    }

    .stars-after::after {
      content: "";
      position: absolute;
      top: 2000px;
      width: 1px;
      height: 1px;
      background: transparent;
      box-shadow: ${starsData.small.length > 0 ? createBoxShadow(starsData.small) : ''};
    }

    .stars2-after::after {
      content: "";
      position: absolute;
      top: 2000px;
      width: 2px;
      height: 2px;
      background: transparent;
      box-shadow: ${starsData.medium.length > 0 ? createBoxShadow(starsData.medium) : ''};
    }

    .stars3-after::after {
      content: "";
      position: absolute;
      top: 2000px;
      width: 3px;
      height: 3px;
      background: transparent;
      box-shadow: ${starsData.big.length > 0 ? createBoxShadow(starsData.big) : ''};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div style={styles.container}>
        {/* Stars Layers */}
        <div style={styles.stars} className="stars-after"></div>
        <div style={styles.stars2} className="stars2-after"></div>
        <div style={styles.stars3} className="stars3-after"></div>
        
        {/* Title */}
        <div style={styles.title}>
          <span style={styles.titleSpan}>MEETINGS</span>
          <br />
          <span style={styles.titleSpan}>DASHBOARD</span>
        </div>

        {/* Meetings Section */}
        <div style={styles.meetingsContainer}>
          <h2 style={styles.sectionTitle}>Your Meetings ({meetings.length})</h2>
          
          {meetings.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}>📅</div>
              <div>No meetings found</div>
              <div style={{fontSize: '14px', marginTop: '10px'}}>Your attended meetings will appear here</div>
            </div>
          ) : (
            <div style={styles.sliderContainer}>
              {/* Navigation Buttons */}
              {Math.ceil(meetings.length / 3) > 1 && (
                <>
                  <button 
                    style={{...styles.navButton, ...styles.prevButton}}
                    className="nav-button"
                    onClick={prevSlide}
                  >
                    ‹
                  </button>
                  <button 
                    style={{...styles.navButton, ...styles.nextButton}}
                    className="nav-button"
                    onClick={nextSlide}
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Slider */}
              <div style={styles.sliderWrapper}>
                {Array.from({length: Math.ceil(meetings.length / 3)}).map((_, slideIndex) => (
                  <div key={slideIndex} style={styles.slide}>
                    {meetings.slice(slideIndex * 3, slideIndex * 3 + 3).map((meeting, index) => {
                      const startTime = formatDateTime(meeting.StartAt);
                      const endTime = formatDateTime(meeting.EndAt);
                      
                      return (
                        <div 
                          key={meeting._id || index} 
                          style={styles.meetingCard}
                          className="meeting-card"
                        >
                          <div className="card-glow" style={styles.cardGlow}></div>
                          
                          {/* Status Badge */}
                          <div style={{
                            ...styles.status,
                            ...(meeting.isEnded ? styles.statusEnded : styles.statusActive)
                          }}>
                            {meeting.isEnded ? 'Ended' : 'Active'}
                          </div>
                          
                          <div style={styles.cardContent}>
                            {/* Header */}
                            <div style={styles.cardHeader}>
                              <div>
                                <div style={styles.hostedBy}>
                                  Host: {meeting.Hosted_by?.display_name || 'Unknown'}
                                </div>
                              </div>
                              <div style={styles.meetingId}>
                                ID: {meeting.Joining_id}
                              </div>
                            </div>

                            {/* Start Time */}
                            <div style={styles.timeSection}>
                              <div style={styles.timeLabel}>Start Time</div>
                              <div style={styles.timeValue}>
                                {startTime.date} at {startTime.time}
                              </div>
                            </div>

                            {/* End Time */}
                            <div style={styles.timeSection}>
                              <div style={styles.timeLabel}>End Time</div>
                              <div style={styles.timeValue}>
                                {meeting.EndAt ? `${endTime.date} at ${endTime.time}` : 'Ongoing'}
                              </div>
                            </div>

                            {/* Participants Count */}
                            <div style={styles.timeSection}>
                              <div style={styles.timeLabel}>Participants</div>
                              <div style={styles.timeValue}>
                                {meeting.Participants?.length || 0} members
                              </div>
                            </div>
                          </div>
                          {/* Action Buttons */}
                          <div style={{
                            position: 'absolute',
                            right: 20,
                            bottom: 20,
                            display: 'flex',
                            gap: '10px',
                            zIndex: 3
                          }}>
                            <button
                              onClick={() => handleView(meeting._id,meeting.Hosted_by._id)}
                              style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(99,102,241,0.15)'
                              }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(meeting._id)}
                              style={{
                                background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(239,68,68,0.15)'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default UserDashboard;