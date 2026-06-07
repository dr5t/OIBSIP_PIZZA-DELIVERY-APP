import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed.');
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
              <h2>Verifying your email...</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <span style={{ fontSize: '4rem', display: 'block', marginBottom: 16 }}>✅</span>
              <h2>Email Verified!</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>{message}</p>
              <Link to="/login" className="btn btn-primary" id="btn-go-login">
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <span style={{ fontSize: '4rem', display: 'block', marginBottom: 16 }}>❌</span>
              <h2>Verification Failed</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>{message}</p>
              <Link to="/register" className="btn btn-secondary" id="btn-go-register">
                Register Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
