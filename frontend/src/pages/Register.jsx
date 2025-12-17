import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match. Please check again.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        showToast('Your account has been created successfully.', 'success', 'Welcome Aboard!');
        navigate('/login');
      } else {
        const errorMsg = result.error || 'Registration failed.';
        if (errorMsg.toLowerCase().includes('email')) {
          showToast('That email is already in use. Try logging in.', 'error');
        } else {
          showToast(errorMsg, 'error');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      showToast('Server error. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Join Us</h2>
          <p className="auth-subtitle">Start helping your community today.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="form-control"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-control"
              placeholder="name@student.university.ac.id"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              className="form-control"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="form-control"
              placeholder="Retype to confirm"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-auth" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already a member? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}