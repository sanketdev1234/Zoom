import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Key, Clock } from 'lucide-react';
import backgroundImg from '../assets/background.jpg';

function generateMeetingId() {
  // Generates a random 8-character alphanumeric string
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

const CreateMeeting = () => {
  const [form, setForm] = useState({
    Joining_id: generateMeetingId(),
    StartAt: '',
    EndAt: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateId = () => {
    setForm((prev) => ({ ...prev, Joining_id: generateMeetingId() }));
    toast.info('New Meeting ID generated!');
  };

  const validate = () => {
    if (!form.Joining_id) {
      toast.error('Meeting ID is required.');
      return false;
    }
    if (!form.StartAt) {
      toast.error('Start time is required.');
      return false;
    }
    if (form.EndAt && new Date(form.EndAt) <= new Date(form.StartAt)) {
      toast.error('End time must be after start time.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await axios.post('/meeting/new', {
        Joining_id: form.Joining_id,
        StartAt: form.StartAt,
        EndAt: form.EndAt || undefined
      }, { withCredentials: true });
      toast.success('Meeting created successfully!');
      setForm({ Joining_id: generateMeetingId(), StartAt: '', EndAt: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create meeting.');
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
        <div className="text-center mb-4">
          <div style={{ fontSize: 40, color: '#6366f1', marginBottom: 8 }}>
            <Calendar size={36} />
          </div>
          <h2 style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            fontSize: '2.1rem',
            marginBottom: 0
          }}>Create a New Meeting</h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Schedule and share your meeting instantly</p>
        </div>

        {/* Meeting ID */}
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: '#374151' }}>
            <Key size={18} style={{ marginRight: 6, color: '#6366f1' }} /> Meeting ID
          </label>
          <div className="input-group">
            <input
              type="text"
              name="Joining_id"
              value={form.Joining_id}
              className="form-control"
              style={{ borderRadius: '12px 0 0 12px', fontWeight: 600, letterSpacing: 2, background: '#f3f4f6' }}
              readOnly
            />
            <button type="button" className="btn btn-outline-primary" style={{ borderRadius: '0 12px 12px 0' }} onClick={handleGenerateId}>
              Generate
            </button>
          </div>
        </div>

        {/* Start Time */}
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ color: '#374151' }}>
            <Clock size={18} style={{ marginRight: 6, color: '#6366f1' }} /> Start Time <span style={{ color: '#e11d48' }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="StartAt"
            value={form.StartAt}
            onChange={handleChange}
            className="form-control"
            style={{ borderRadius: '12px', background: '#f3f4f6' }}
            required
          />
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label className="form-label fw-semibold" style={{ color: '#374151' }}>
            <Clock size={18} style={{ marginRight: 6, color: '#6366f1' }} /> End Time (optional)
          </label>
          <input
            type="datetime-local"
            name="EndAt"
            value={form.EndAt}
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
              Creating Meeting...
            </span>
          ) : (
            'Create Meeting'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;