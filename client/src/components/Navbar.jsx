import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiHome, FiShoppingBag, FiPackage, FiBox } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar-brand">
          <span className="pizza-icon">🍕</span>
          <span>PizzaCraft</span>
        </Link>

        <div className="navbar-links">
          {isAdmin ? (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`} id="nav-admin-dashboard">
                <FiHome style={{ marginRight: 4 }} /> Dashboard
              </Link>
              <Link to="/admin/inventory" className={`nav-link ${isActive('/admin/inventory')}`} id="nav-inventory">
                <FiBox style={{ marginRight: 4 }} /> Inventory
              </Link>
              <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders')}`} id="nav-admin-orders">
                <FiPackage style={{ marginRight: 4 }} /> Orders
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} id="nav-dashboard">
                <FiHome style={{ marginRight: 4 }} /> Dashboard
              </Link>
              <Link to="/build-pizza" className={`nav-link ${isActive('/build-pizza')}`} id="nav-build-pizza">
                🍕 Build Pizza
              </Link>
              <Link to="/my-orders" className={`nav-link ${isActive('/my-orders')}`} id="nav-my-orders">
                <FiShoppingBag style={{ marginRight: 4 }} /> My Orders
              </Link>
            </>
          )}

          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0 8px' }}>
            Hi, {user?.name}
          </span>

          <button onClick={handleLogout} className="nav-link logout-btn" id="btn-logout">
            <FiLogOut style={{ marginRight: 4 }} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
