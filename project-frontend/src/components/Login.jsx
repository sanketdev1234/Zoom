import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../assets/background.jpg';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Login successful! Welcome back.');
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
        toast.error(error.response.data.message);
      } else {
        setErrors({ general: 'Login failed. Please check your credentials.' });
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 m-0" style={{ minHeight: '100vh', width: '100%' }}>
      <div className="row g-0" style={{ minHeight: '100vh' }}>
        {/* Left: Background Image */}
        <div className="col-12 col-md-8 position-relative" style={{
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          {/* Form overlays image on mobile */}
          <div className="d-md-none position-absolute top-50 start-50 translate-middle w-100 px-3" style={{ zIndex: 2 }}>
            <div className="login-card mx-auto" style={{
              background: 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '2rem 1rem',
              boxShadow: '0 8px 32px 0 rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.10)',
              maxWidth: 400,
              width: '100%'
            }}>
              {/* --- FORM CONTENT BELOW --- */}
              <ToastContainer position="top-right" autoClose={3000} />
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
                  Welcome Back
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Sign in to your account
                </p>
              </div>

              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                    Email Address *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{
                      background: 'transparent',
                      border: errors.email ? '2px solid #dc3545' : '2px solid #e5e7eb',
                      borderRight: 'none',
                      borderRadius: '12px 0 0 12px',
                      borderRight: 'none'
                    }}>
                      <i className="bi bi-envelope" style={{ color: '#6b7280' }}></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      style={{
                        borderRadius: '0 12px 12px 0',
                        border: errors.email ? '2px solid #dc3545' : '2px solid #e5e7eb',
                        borderLeft: 'none',
                        padding: '12px 16px',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                    Password *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{
                      background: 'transparent',
                      border: errors.password ? '2px solid #dc3545' : '2px solid #e5e7eb',
                      borderRight: 'none',
                      borderRadius: '12px 0 0 12px',
                      borderRight: 'none'
                    }}>
                      <i className="bi bi-lock" style={{ color: '#6b7280' }}></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      style={{
                        borderRadius: '0 12px 12px 0',
                        border: errors.password ? '2px solid #dc3545' : '2px solid #e5e7eb',
                        borderLeft: 'none',
                        padding: '12px 16px',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      style={{
                        borderRadius: '4px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                    <label className="form-check-label" htmlFor="rememberMe" style={{ color: '#6b7280' }}>
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{
                      color: '#6366f1',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    Forgot password?
                  </button>
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
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p style={{ color: '#6b7280' }}>
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="btn btn-link p-0"
                    style={{
                      color: '#6366f1',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Create account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Login Form for md+ */}
        <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center" style={{ background: 'white', minHeight: '100vh' }}>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="login-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '450px',
            width: '100%'
          }}>
            {/* --- FORM CONTENT BELOW --- */}
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
                Welcome Back
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Sign in to your account
              </p>
            </div>

            {errors.general && (
              <div className="alert alert-danger" role="alert">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                  Email Address *
                </label>
                <div className="input-group">
                  <span className="input-group-text" style={{
                    background: 'transparent',
                    border: errors.email ? '2px solid #dc3545' : '2px solid #e5e7eb',
                    borderRight: 'none',
                    borderRadius: '12px 0 0 12px',
                    borderRight: 'none'
                  }}>
                    <i className="bi bi-envelope" style={{ color: '#6b7280' }}></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '0 12px 12px 0',
                      border: errors.email ? '2px solid #dc3545' : '2px solid #e5e7eb',
                      borderLeft: 'none',
                      padding: '12px 16px',
                      transition: 'all 0.3s ease'
                    }}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                  Password *
                </label>
                <div className="input-group">
                  <span className="input-group-text" style={{
                    background: 'transparent',
                    border: errors.password ? '2px solid #dc3545' : '2px solid #e5e7eb',
                    borderRight: 'none',
                    borderRadius: '12px 0 0 12px',
                    borderRight: 'none'
                  }}>
                    <i className="bi bi-lock" style={{ color: '#6b7280' }}></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    style={{
                      borderRadius: '0 12px 12px 0',
                      border: errors.password ? '2px solid #dc3545' : '2px solid #e5e7eb',
                      borderLeft: 'none',
                      padding: '12px 16px',
                      transition: 'all 0.3s ease'
                    }}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    style={{
                      borderRadius: '4px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                  <label className="form-check-label" htmlFor="rememberMe" style={{ color: '#6b7280' }}>
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-link p-0"
                  style={{
                    color: '#6366f1',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  Forgot password?
                </button>
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
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p style={{ color: '#6b7280' }}>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="btn btn-link p-0"
                  style={{
                    color: '#6366f1',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;