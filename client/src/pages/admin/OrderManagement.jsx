import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';

const STATUS_OPTIONS = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

const STATUS_CONFIG = {
  'Order Received': { class: 'order-received', icon: '📦' },
  'In the Kitchen': { class: 'in-kitchen', icon: '👨‍🍳' },
  'Sent to Delivery': { class: 'sent-delivery', icon: '🚗' },
  'Delivered': { class: 'delivered', icon: '✅' },
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));

    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to "${newStatus}"`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

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
          <h1>Order Management 📋</h1>
          <p>Manage and update customer order statuses</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
            id="filter-all"
          >
            All ({orders.length})
          </button>
          {STATUS_OPTIONS.map(status => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(status)}
                id={`filter-${status.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {STATUS_CONFIG[status].icon} {status} ({count})
              </button>
            );
          })}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No orders found</h3>
            <p>{filter === 'all' ? 'No orders have been placed yet.' : `No orders with status "${filter}".`}</p>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Pizza</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className="animate-fade-up">
                    <td style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div>{order.customerName || order.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        <span className="order-item-tag">{order.pizzaDetails?.base?.name}</span>
                        <span className="order-item-tag">{order.pizzaDetails?.sauce?.name}</span>
                        <span className="order-item-tag">{order.pizzaDetails?.cheese?.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{order.totalPrice}</td>
                    <td>
                      <span className={`status-badge ${STATUS_CONFIG[order.status]?.class || ''}`}>
                        {STATUS_CONFIG[order.status]?.icon} {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating[order._id] || order.status === 'Delivered'}
                        id={`status-select-${order._id}`}
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 24 }}>
          🔄 Orders auto-refresh every 30 seconds
        </p>
      </div>
    </div>
  );
};

export default OrderManagement;
