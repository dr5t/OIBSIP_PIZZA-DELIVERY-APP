import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const PIZZA_EMOJIS = ['🍕', '🫓', '🧀', '🍅', '🌿'];
const PIZZA_NAMES = [
  { name: 'Margherita Classic', desc: 'Fresh tomato, mozzarella, basil', price: 299, emoji: '🍕' },
  { name: 'Pepperoni Supreme', desc: 'Loaded with spicy pepperoni', price: 399, emoji: '🍕' },
  { name: 'BBQ Chicken', desc: 'Smoky BBQ sauce, grilled chicken', price: 449, emoji: '🍗' },
  { name: 'Veggie Delight', desc: 'Bell peppers, mushrooms, olives', price: 349, emoji: '🥬' },
  { name: 'Pesto Paradise', desc: 'Fresh pesto, sun-dried tomatoes', price: 429, emoji: '🌿' },
  { name: 'Quattro Formaggi', desc: 'Four premium cheeses blend', price: 499, emoji: '🧀' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await API.get('/inventory/available');
        setInventory(data.grouped);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard-header animate-fade-up">
          <h1>Welcome, {user?.name}! 🍕</h1>
          <p>Explore our delicious pizza varieties or build your own masterpiece</p>
        </div>

        {inventory ? (
          <div className="notification-bar">
            <span className="notif-icon">✨</span>
            <p>
              <strong>Build your custom pizza!</strong> Choose from {inventory ? `${inventory.base?.length || 0} bases, ${inventory.sauce?.length || 0} sauces, and more` : 'our fresh ingredients'}.
            </p>
            <Link to="/build-pizza" className="btn btn-primary btn-sm" id="btn-start-building">
              Start Building →
            </Link>
          </div>
        ) : null}

        <h2 className="section-title">
          <span className="icon">🍕</span> Popular Pizza Varieties
        </h2>

        <div className="pizza-showcase">
          {PIZZA_NAMES.map((pizza, idx) => (
            <div key={idx} className="pizza-card animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="pizza-card-image">
                <span>{pizza.emoji}</span>
              </div>
              <div className="pizza-card-body">
                <h3>{pizza.name}</h3>
                <p>{pizza.desc}</p>
                <div className="pizza-card-footer">
                  <span className="pizza-price">₹{pizza.price}</span>
                  <Link to="/build-pizza" className="btn btn-outline btn-sm" id={`btn-order-${idx}`}>
                    Customize
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {inventory && (
          <div style={{ marginTop: 48 }}>
            <h2 className="section-title">
              <span className="icon">🥗</span> Fresh Ingredients Available
            </h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orders">🫓</div>
                <div className="stat-info">
                  <h3>{inventory.base?.length || 0}</h3>
                  <p>Pizza Bases</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pending">🍅</div>
                <div className="stat-info">
                  <h3>{inventory.sauce?.length || 0}</h3>
                  <p>Sauces</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon delivered">🧀</div>
                <div className="stat-info">
                  <h3>{inventory.cheese?.length || 0}</h3>
                  <p>Cheeses</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon revenue">🥬</div>
                <div className="stat-info">
                  <h3>{(inventory.veggie?.length || 0) + (inventory.meat?.length || 0)}</h3>
                  <p>Toppings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="spinner-wrapper">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
