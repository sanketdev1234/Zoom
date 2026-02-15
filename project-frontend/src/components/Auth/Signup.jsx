import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImg from '../../assets/background.jpg';
import S from "../../assets/S.webp";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    display_name: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    gender: '',
    profile_picture: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

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
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
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
      const data = new FormData();

      data.append("display_name", formData.display_name);
      data.append("full_name", formData.full_name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("date_of_birth", formData.date_of_birth);
      data.append("gender", formData.gender);

      if (formData.profile_picture) {
        console.log("the profile_picture is", formData.profile_picture);
        data.append("profile_picture", formData.profile_picture);
      }

      const response = await axios.post('/auth/signup', data, { withCredentials: true });

      if (response.status === 201) {
        toast.success('Signup successful! Please proceed to login.');
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
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
        }

        .signup-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
          background-image: url(${backgroundImg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .signup-card {
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
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
          margin-bottom: 24px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 6px;
          display: block;
        }

        .form-control,
        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-control:focus,
        .form-select:focus {
          outline: none;
          border-color: #0a66c2;
        }

        .form-control.is-invalid,
        .form-select.is-invalid {
          border-color: #dc3545;
        }

        .invalid-feedback {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .profile-upload {
          text-align: center;
          margin-bottom: 24px;
        }

        .profile-preview-wrapper {
          position: relative;
          display: inline-block;
        }

        .profile-preview {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e0e0e0;
        }

        .upload-button {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #0a66c2;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid white;
          font-size: 18px;
          font-weight: 600;
        }

        .upload-label {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
          margin-top: 8px;
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

        .signin-link {
          text-align: center;
          margin-top: 24px;
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
        }

        .signin-link button {
          background: none;
          border: none;
          color: #0a66c2;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
        }

        .signin-link button:hover {
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
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
          .signup-card {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="signup-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="signup-card">
          <h2 className="page-title">Create Account</h2>
          <p className="page-subtitle">Join our video calling platform</p>

          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Display Name *</label>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className={`form-control ${errors.display_name ? 'is-invalid' : ''}`}
                  placeholder="Enter display name"
                />
                {errors.display_name && (
                  <div className="invalid-feedback">{errors.display_name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <div className="invalid-feedback">{errors.full_name}</div>
                )}
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="profile-upload">
              <div className="profile-preview-wrapper">
                <img
                  src={previewUrl || S}
                  alt="Profile Preview"
                  className="profile-preview"
                />
                <label htmlFor="profile_picture" className="upload-button">
                  +
                </label>
                <input
                  type="file"
                  id="profile_picture"
                  name="profile_picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              <p className="upload-label">Upload Profile Picture</p>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email address"
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
                placeholder="Enter password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                />
                {errors.date_of_birth && (
                  <div className="invalid-feedback">{errors.date_of_birth}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
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

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <>
                  <span className="spinner-border" role="status"></span>
                  {' '}Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="signin-link">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')}>
              Log in here
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;