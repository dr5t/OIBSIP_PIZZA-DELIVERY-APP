import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiClock, FiCheckCircle, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [orderStats, setOrderStats] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderRes, invRes] = await Promise.all([
          API.get('/orders/stats'),
          API.get('/inventory/stats')
        ]);
        setOrderStats(orderRes.data);
        setInventoryStats(invRes.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard-header animate-fade-up">
          <h1>Admin Dashboard 🎛️</h1>
          <p>Monitor orders, inventory, and business metrics</p>
        </div>

        {inventoryStats?.lowStockCount > 0 && (
          <div className="notification-bar" style={{ borderColor: 'rgba(255, 23, 68, 0.3)', background: 'rgba(255, 23, 68, 0.08)' }}>
            <span className="notif-icon">⚠️</span>
            <p>
              <strong>{inventoryStats.lowStockCount} items</strong> are running low on stock!{' '}
              <Link to="/admin/inventory" style={{ color: 'var(--danger)', fontWeight: 600 }}>
                View Inventory →
              </Link>
            </p>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card animate-fade-up">
            <div className="stat-icon orders"><FiShoppingBag size={24} /></div>
            <div className="stat-info">
              <h3>{orderStats?.totalOrders || 0}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon pending"><FiClock size={24} /></div>
            <div className="stat-info">
              <h3>{orderStats?.pendingOrders || 0}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon delivered"><FiCheckCircle size={24} /></div>
            <div className="stat-info">
              <h3>{orderStats?.deliveredOrders || 0}</h3>
              <p>Delivered</p>
            </div>
          </div>
          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon revenue"><FiDollarSign size={24} /></div>
            <div className="stat-info">
              <h3>₹{orderStats?.totalRevenue || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-icon stock"><FiAlertTriangle size={24} /></div>
            <div className="stat-info">
              <h3>{inventoryStats?.lowStockCount || 0}</h3>
              <p>Low Stock Items</p>
            </div>
          </div>
        </div>

        {orderStats?.statusCounts && (
          <div style={{ marginBottom: 32 }}>
            <h2 className="section-title"><span className="icon">📊</span> Order Status Breakdown</h2>
            <div className="stats-grid">
              {Object.entries(orderStats.statusCounts).map(([status, count]) => (
                <div key={status} className="card" style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>{count}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              <span className="icon">🕐</span> Recent Orders
            </h2>
            <Link to="/admin/orders" className="btn btn-outline btn-sm" id="btn-view-all-orders">
              View All Orders
            </Link>
          </div>

          {orderStats?.recentOrders?.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orderStats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                      <td>{order.customerName || order.user?.name || 'N/A'}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{order.totalPrice}</td>
                      <td>
                        <span className={`status-badge ${
                          order.status === 'Order Received' ? 'order-received' :
                          order.status === 'In the Kitchen' ? 'in-kitchen' :
                          order.status === 'Sent to Delivery' ? 'sent-delivery' : 'delivered'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No orders yet</h3>
              <p>Orders will appear here once customers start ordering.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
