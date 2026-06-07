import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const STATUS_CONFIG = {
  'Order Received': { class: 'order-received', icon: '📦', step: 1 },
  'In the Kitchen': { class: 'in-kitchen', icon: '👨‍🍳', step: 2 },
  'Sent to Delivery': { class: 'sent-delivery', icon: '🚗', step: 3 },
  'Delivered': { class: 'delivered', icon: '✅', step: 4 },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusProgress = (status) => {
    const config = STATUS_CONFIG[status];
    return config ? config.step : 0;
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard-header animate-fade-up">
          <h1>My Orders 📋</h1>
          <p>Track your pizza orders in real-time</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍕</span>
            <h3>No orders yet</h3>
            <p>Build your first custom pizza and place an order!</p>
            <Link to="/build-pizza" className="btn btn-primary" style={{ marginTop: 20 }} id="btn-first-order">
              Build My Pizza
            </Link>
          </div>
        ) : (
          <div>
            {orders.map((order, idx) => (
              <div key={order._id} className="order-card animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="order-card-header">
                  <div>
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <span className={`status-badge ${STATUS_CONFIG[order.status]?.class || ''}`}>
                    {STATUS_CONFIG[order.status]?.icon} {order.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '16px 0', padding: '0 8px' }}>
                  {Object.entries(STATUS_CONFIG).map(([status, config], i) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: getStatusProgress(order.status) >= config.step ? 'var(--success)' : 'var(--bg-elevated)',
                        color: getStatusProgress(order.status) >= config.step ? 'white' : 'var(--text-muted)',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                      }}>
                        {config.icon}
                      </div>
                      {i < 3 && (
                        <div style={{
                          flex: 1,
                          height: 2,
                          background: getStatusProgress(order.status) > config.step ? 'var(--success)' : 'var(--border)',
                          transition: 'all 0.3s ease'
                        }}></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="order-items-list">
                  <span className="order-item-tag">🫓 {order.pizzaDetails.base?.name}</span>
                  <span className="order-item-tag">🍅 {order.pizzaDetails.sauce?.name}</span>
                  <span className="order-item-tag">🧀 {order.pizzaDetails.cheese?.name}</span>
                  {order.pizzaDetails.veggies?.map((v, i) => (
                    <span key={i} className="order-item-tag">🥬 {v.name}</span>
                  ))}
                  {order.pizzaDetails.meat?.map((m, i) => (
                    <span key={i} className="order-item-tag">🍖 {m.name}</span>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Payment: {order.paymentId ? `✅ ${order.paymentId.slice(0, 16)}...` : 'N/A'}
                  </span>
                  <span className="pizza-price">₹{order.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 24 }}>
          🔄 Status auto-refreshes every 30 seconds
        </p>
      </div>
    </div>
  );
};

export default MyOrders;
