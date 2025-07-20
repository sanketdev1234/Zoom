import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    display_name: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false,
    noSpaces: true
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])([^\s]){8,}$/;
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      noSpaces: !/\s/.test(password)
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Password validation
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])([^\s]){8,}$/.test(formData.password)) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/auth/signup', {
        display_name: formData.display_name,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender
      }, { withCredentials: true });

      if (response.status === 201) {
        toast.success('Signup successful! Please proceed for final login.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
        toast.error(error.response.data.message);
      } else {
        setErrors({ general: 'Signup failed. Please try again.' });
        toast.error('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    }}>
         <ToastContainer position="top-right" autoClose={3000} />
      <div className="signup-card" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div className="text-center mb-4">
          <h2 style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Join our video calling platform
          </p>
        </div>

        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                Display Name *
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                className={`form-control ${errors.display_name ? 'is-invalid' : ''}`}
                style={{
                  borderRadius: '12px',
                  border: errors.display_name ? '2px solid #dc3545' : '2px solid #e5e7eb',
                  padding: '12px 16px',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Enter display name"
              />
              {errors.display_name && (
                <div className="invalid-feedback">{errors.display_name}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                style={{
                  borderRadius: '12px',
                  border: errors.full_name ? '2px solid #dc3545' : '2px solid #e5e7eb',
                  padding: '12px 16px',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Enter full name"
              />
              {errors.full_name && (
                <div className="invalid-feedback">{errors.full_name}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#374151' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              style={{
                borderRadius: '12px',
                border: errors.email ? '2px solid #dc3545' : '2px solid #e5e7eb',
                padding: '12px 16px',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#374151' }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              style={{
                borderRadius: '12px',
                border: errors.password ? '2px solid #dc3545' : '2px solid #e5e7eb',
                padding: '12px 16px',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
            
            {/* Password Strength Indicator */}
            <div className="mt-2">
              <div className="d-flex flex-wrap gap-2">
                {Object.entries(passwordStrength).map(([key, valid]) => (
                  <span
                    key={key}
                    className="badge"
                    style={{
                      backgroundColor: valid ? '#10b981' : '#6b7280',
                      fontSize: '0.75rem',
                      padding: '4px 8px'
                    }}
                  >
                    {key === 'length' && '8+ chars'}
                    {key === 'lowercase' && 'a-z'}
                    {key === 'uppercase' && 'A-Z'}
                    {key === 'digit' && '0-9'}
                    {key === 'special' && '!@#'}
                    {key === 'noSpaces' && 'no spaces'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#374151' }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              style={{
                borderRadius: '12px',
                border: errors.confirmPassword ? '2px solid #dc3545' : '2px solid #e5e7eb',
                padding: '12px 16px',
                transition: 'all 0.3s ease'
              }}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                style={{
                  borderRadius: '12px',
                  border: errors.date_of_birth ? '2px solid #dc3545' : '2px solid #e5e7eb',
                  padding: '12px 16px',
                  transition: 'all 0.3s ease'
                }}
              />
              {errors.date_of_birth && (
                <div className="invalid-feedback">{errors.date_of_birth}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                style={{
                  borderRadius: '12px',
                  border: errors.gender ? '2px solid #dc3545' : '2px solid #e5e7eb',
                  padding: '12px 16px',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <div className="invalid-feedback">{errors.gender}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
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
          >
            {isLoading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="btn btn-link p-0"
              style={{
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Log  in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;