import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
export default function DisplayProfile() {

  const {wantid}=useParams();

  const [profile,setprofile]=useState({

    headline: '',
    bio: '',
    location: '',
    social: {
      twitter: '',
      github: '',
      linkedin: ''
    },
    Education: [],
    Experience: [],
    owner: {
      full_name:'',
    }
  }
);
  useEffect(()=>{
        async function getprofile(){
            const response=await axios.get(`/profile/get/${wantid}`,{withCredentials:true})
            console.log(typeof(response));
            console.log(response.data)
            setprofile(response.data.profile);
        }
        getprofile();
  },[]);

    const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileWrapper}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.name}>{profile.owner.full_name}</h1>
            <h2 style={styles.headline}>{profile.headline}</h2>
            {profile.location && (
              <p style={styles.location}>{profile.location}</p>
            )}
          </div>
          
          {/* Social Links */}
          <div style={styles.socialLinks}>
            {profile.social.twitter && (
              <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                Twitter
              </a>
            )}
            {profile.social.github && (
              <a href={profile.social.github} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                GitHub
              </a>
            )}
            {profile.social.linkedin && (
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* About Section */}
        {profile.bio && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>About</h3>
            <p style={styles.bio}>{profile.bio}</p>
          </div>
        )}

        {/* E Section */}
        {profile.Experience.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Experience</h3>
            {profile.Experience.map((exp, index) => (
              <div key={index} style={styles.item}>
                <div style={styles.itemHeader}>
                  <div>
                    <h4 style={styles.itemTitle}>{exp.title}</h4>
                    <p style={styles.company}>{exp.company}</p>
                    {exp.location && (
                      <p style={styles.itemLocation}>{exp.location}</p>
                    )}
                  </div>
                  <span style={styles.date}>
                    {formatDate(exp.from)} - {exp.current ? 'Present' : formatDate(exp.to)}
                  </span>
                </div>
                {exp.description && (
                  <p style={styles.description}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {profile.Education.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Education</h3>
            {profile.Education.map((edu, index) => (
              <div key={index} style={styles.item}>
                <div style={styles.itemHeader}>
                  <div>
                    <h4 style={styles.itemTitle}>
                      {edu.degree} in {edu.field_of_study}
                    </h4>
                    <p style={styles.company}>{edu.school}</p>
                    {edu.gpa && (
                      <p style={styles.gpa}>GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span style={styles.date}>
                    {formatDate(edu.from)} - {edu.current ? 'Present' : formatDate(edu.to)}
                  </span>
                </div>
                {edu.description && (
                  <p style={styles.description}>{edu.description}</p>
                )}
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
    backgroundColor: '#f8f9fa',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  profileWrapper: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  header: {
    background: 'linear-gradient(135deg, #616167ff 0%, #19181aff 100%)',
    color: 'white',
    padding: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px'
  },
  headerContent: {
    flex: 1
  },
  name: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  headline: {
    fontSize: '20px',
    fontWeight: '400',
    margin: '0 0 12px 0',
    opacity: 0.95
  },
  location: {
    fontSize: '16px',
    margin: 0
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  socialLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500'
  },
  section: {
    padding: '40px',
    borderBottom: '1px solid #e9ecef'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '25px',
    paddingBottom: '10px',
    borderBottom: '3px solid #101012ff',
    display: 'inline-block'
  },
  bio: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#495057',
    margin: 0
  },
  item: {
    marginBottom: '30px',
    paddingBottom: '25px',
    borderBottom: '1px solid #f1f3f5'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    gap: '15px'
  },
  itemTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 6px 0'
  },
  company: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1139ecff',
    margin: '0 0 4px 0'
  },
  itemLocation: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '0'
  },
  date: {
    fontSize: '14px',
    color: '#6c757d',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#495057',
    margin: '10px 0 0 0'
  },
  gpa: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '4px 0 0 0',
    fontWeight: '500'
  }
};