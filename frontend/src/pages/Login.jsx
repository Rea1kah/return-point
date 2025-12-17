import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        showToast(`Welcome back! Ready to explore?`, 'success', 'Login Successful');
        navigate('/');
      } else {
        showToast(result.error || 'Please check your credentials.', 'error', 'Login Failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Something went wrong. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Enter your details to access your dashboard.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="hello@example.com"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">Password</label>
              <Link to="/forgot-password" className="auth-link-sm">Forgot Password?</Link>
            </div>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-auth" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Are you new here? <Link to="/register" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
}