import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../../assets/background.jpg';

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
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
        }

        .login-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        .login-left {
          flex: 1;
          background-image: url(${backgroundImg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
        }

        .login-right {
          width: 100%;
          max-width: 450px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 8px;
          text-align: center;
        }

        .page-subtitle {
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
          text-align: center;
          margin-bottom: 32px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 6px;
          display: block;
        }

        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #0a66c2;
        }

        .form-control.is-invalid {
          border-color: #dc3545;
        }

        .invalid-feedback {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .form-check {
          display: flex;
          align-items: center;
        }

        .form-check-input {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          cursor: pointer;
        }

        .form-check-label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #0a66c2;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .btn-primary {
          width: 100%;
          background: #0a66c2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #004182;
        }

        .btn-primary:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .signup-link {
          text-align: center;
          margin-top: 24px;
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
        }

        .signup-link button {
          background: none;
          border: none;
          color: #0a66c2;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .signup-link button:hover {
          text-decoration: underline;
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .alert-danger {
          background: #fee;
          color: #dc3545;
          border: 1px solid #fcc;
        }

        .spinner-border {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-rotation 0.75s linear infinite;
        }

        @keyframes spinner-rotation {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-left {
            display: none;
          }

          .login-right {
            max-width: 100%;
            padding: 24px;
          }

          .login-container {
            background-image: url(${backgroundImg});
            background-size: cover;
            background-position: center;
          }

          .login-card {
            background: white;
            padding: 32px 24px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>

      <div className="login-container">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Left side - Background Image (hidden on mobile) */}
        <div className="login-left"></div>

        {/* Right side - Login Form */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="page-title">Welcome Back</h2>
            <p className="page-subtitle">Sign in to your account</p>

            {errors.general && (
              <div className="alert alert-danger" role="alert">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="form-options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="forgot-link"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? (
                  <>
                    <span className="spinner-border" role="status"></span>
                    {' '}Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="signup-link">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')}>
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;