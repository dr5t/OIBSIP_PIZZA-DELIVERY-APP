import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth(); // using login to update context user state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
      } catch (error) {
        toast.error('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      
      // Update local storage and context
      const token = localStorage.getItem('token');
      login(data.user, token);
      
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="auth-card animate-fade-up" style={{ maxWidth: 600, margin: '40px auto' }}>
          <div className="auth-header">
            <span className="logo">👤</span>
            <h1>My Profile</h1>
            <p>Manage your account details and delivery address</p>
          </div>

          <form onSubmit={handleSubmit} id="profile-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                <FiUser style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                title="Email cannot be changed"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                <FiPhone style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                <FiMapPin style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Default Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                className="form-input"
                placeholder="Enter your complete delivery address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 10 }} disabled={loading}>
              {loading ? 'Saving...' : <><FiSave style={{ marginRight: 8 }} /> Save Profile</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
