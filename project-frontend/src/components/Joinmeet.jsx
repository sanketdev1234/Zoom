import React, { useEffect, useState } from 'react';
import axios, { formToJSON } from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../assets/background.jpg';
import { useNavigate } from 'react-router-dom';


const Joinmeeting = () => {

  const Navigate=useNavigate();
  const [form, setForm] = useState({
    Joining_id: '',
    email:''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  const validate = () => {
    if (!form.Joining_id) {
      toast.error('Meeting ID is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response=await axios.get(`/meeting/${form.Joining_id}/join`, { withCredentials: true });
      toast.success('Meeting join successfully! welcome to meet');
      console.log(response.data);
      setTimeout(() => {
        Navigate(`/ongoingmeet/${response.data._id}/${form.Joining_id}`);
      }, 2000);
    //   setForm({ Joining_id:'', email:''});
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join meeting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ 
      minHeight: '100vh',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>

      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="shadow-lg" style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '2rem',
        padding: '2.5rem 2rem',
        minWidth: 340,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 8px 32px 0 rgba(99,102,241,0.25)',
        border: '1px solid rgba(99,102,241,0.12)'
      }}>
            <h2 style={{
            color:'black',
            fontWeight: 700,
            fontSize: '2.1rem',
            marginBottom: 0
          }}>Join a  Meeting With Joining Id</h2>
        <br></br>
        {/* Meeting ID */}
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: '#374151' }}>
            Meeting Joining ID
          </label>
          <div className="input-group">
            <input
            onChange={handleChange}
              type="text"
              name="Joining_id"
              value={form.Joining_id}
              className="form-control"
              style={{ borderRadius: '12px 0 0 12px', fontWeight: 600, letterSpacing: 2, background: '#f3f4f6' }}
             
            />
          </div>
        </div>



        {/* email */}
        <div className="mb-4">
          <label className="form-label fw-semibold" style={{ color: '#374151' }}>
            Email 
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            style={{ borderRadius: '12px', background: '#f3f4f6' }}
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '14px 24px',
            fontWeight: '600',
            fontSize: '1.1rem',
            border: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Joining Meeting...
            </span>
          ) : (
            'Join Meeting'
          )}
        </button>
      </form>
    </div>
  );
};

export default Joinmeeting;