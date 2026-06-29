import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderData] = useState(() => {
    const saved = sessionStorage.getItem('pizza_order');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(user?.address || '');

  useEffect(() => {
    if (!orderData) {
      toast.error('No pizza order found. Please build a pizza first.');
      navigate('/build-pizza');
    }
  }, [orderData, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address.');
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const { data } = await API.post('/payment/create-order', {
        amount: orderData.totalPrice
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PizzaCraft 🍕',
        description: 'Custom Pizza Order',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await API.post('/orders', {
                pizzaDetails: orderData.pizzaData,
                totalPrice: orderData.totalPrice,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                deliveryAddress: address
              });

              sessionStorage.removeItem('pizza_order');
              toast.success('🎉 Order placed successfully!');
              navigate('/my-orders');
            }
          } catch (error) {
            console.error('Payment handler error:', error);
            toast.error('Order placement failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#e94560',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info('Payment cancelled.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
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
        <div className="checkout-wrapper animate-fade-up">
          <div className="dashboard-header" style={{ textAlign: 'center' }}>
            <h1>Checkout 💳</h1>
            <p>Complete your payment to place the order</p>
          </div>

          <div className="order-summary">
            <h3>🍕 Order Summary</h3>
            <div className="summary-item">
              <span className="label">Base</span>
              <span className="value">{orderData.pizzaData.base.name} — ₹{orderData.pizzaData.base.price}</span>
            </div>
            <div className="summary-item">
              <span className="label">Sauce</span>
              <span className="value">{orderData.pizzaData.sauce.name} — ₹{orderData.pizzaData.sauce.price}</span>
            </div>
            <div className="summary-item">
              <span className="label">Cheese</span>
              <span className="value">{orderData.pizzaData.cheese.name} — ₹{orderData.pizzaData.cheese.price}</span>
            </div>
            {orderData.pizzaData.veggies.length > 0 && (
              <div className="summary-item">
                <span className="label">Veggies</span>
                <span className="value">
                  {orderData.pizzaData.veggies.map(v => v.name).join(', ')} — ₹{orderData.pizzaData.veggies.reduce((s, v) => s + v.price, 0)}
                </span>
              </div>
            )}
            {orderData.pizzaData.meat.length > 0 && (
              <div className="summary-item">
                <span className="label">Meat</span>
                <span className="value">
                  {orderData.pizzaData.meat.map(m => m.name).join(', ')} — ₹{orderData.pizzaData.meat.reduce((s, m) => s + m.price, 0)}
                </span>
              </div>
            )}
            <div className="summary-total">
              <span>Total Amount</span>
              <span className="amount">₹{orderData.totalPrice}</span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="delivery-address">📍 Delivery Address</label>
              <input
                type="text"
                id="delivery-address"
                className="form-input"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="payment-info">
            <div className="razorpay-logo">💳</div>
            <p>Secure payment powered by <strong>Razorpay</strong> (Test Mode)</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Use test card: <strong>4111 1111 1111 1111</strong> | Expiry: Any future date | CVV: Any 3 digits
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handlePayment}
              disabled={loading}
              id="btn-pay-now"
              style={{ width: '100%' }}
            >
              {loading ? 'Processing...' : `Pay ₹${orderData.totalPrice} with Razorpay`}
            </button>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/build-pizza')}
            style={{ width: '100%', marginTop: 16 }}
            id="btn-back-to-builder"
          >
            ← Back to Pizza Builder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
