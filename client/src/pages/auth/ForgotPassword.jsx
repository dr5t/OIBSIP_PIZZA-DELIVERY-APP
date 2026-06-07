import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock } from 'react-icons/fi';
import API from '../../api/axios';

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const isResetMode = !!token;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      toast.success(data.message);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, { password });
      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="logo">{isResetMode ? '🔑' : '📧'}</span>
            <h1>{isResetMode ? 'Reset Password' : 'Forgot Password'}</h1>
            <p>{isResetMode ? 'Enter your new password below' : 'Enter your email to receive a reset link'}</p>
          </div>

          {!isResetMode ? (
            sent ? (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>📬</span>
                <h3>Check Your Email</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
                  If an account exists with that email, we've sent a password reset link.
                </p>
                <Link to="/login" className="btn btn-secondary">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleForgot} id="forgot-password-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">
                    <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="btn-send-reset">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleReset} id="reset-password-form">
              <div className="form-group">
                <label className="form-label" htmlFor="new-password">
                  <FiLock style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm-new-password">
                  <FiLock style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-new-password"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="btn-reset-password">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
