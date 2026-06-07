import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import API from '../../api/axios';

const CATEGORY_LABELS = {
  base: '🫓 Pizza Bases',
  sauce: '🍅 Sauces',
  cheese: '🧀 Cheeses',
  veggie: '🥬 Veggies',
  meat: '🍖 Meats'
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [editedItems, setEditedItems] = useState({});
  const [saving, setSaving] = useState({});

  const fetchInventory = async () => {
    try {
      const { data } = await API.get('/inventory');
      setItems(data.items);
      setGrouped(data.grouped);
    } catch (error) {
      toast.error('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleFieldChange = (itemId, field, value) => {
    setEditedItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: Number(value)
      }
    }));
  };

  const handleSave = async (itemId) => {
    const changes = editedItems[itemId];
    if (!changes) return;

    setSaving(prev => ({ ...prev, [itemId]: true }));

    try {
      await API.put(`/inventory/${itemId}`, changes);
      toast.success('Inventory updated!');
      setEditedItems(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
      fetchInventory();
    } catch (error) {
      toast.error('Failed to update item.');
    } finally {
      setSaving(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSeed = async () => {
    try {
      const { data } = await API.post('/inventory/seed');
      toast.success(data.message);
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to seed inventory.');
    }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Inventory Management 📦</h1>
              <p>Manage stock levels, pricing, and thresholds</p>
            </div>
            {items.length === 0 && (
              <button className="btn btn-primary" onClick={handleSeed} id="btn-seed-inventory">
                🌱 Seed Initial Data
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No inventory items</h3>
            <p>Click "Seed Initial Data" to populate with default pizza ingredients.</p>
          </div>
        ) : (
          Object.entries(CATEGORY_LABELS).map(([category, label]) => {
            const categoryItems = grouped[category] || [];
            if (categoryItems.length === 0) return null;
            
            const lowStockCount = categoryItems.filter(i => i.quantity <= i.threshold).length;

            return (
              <div key={category} className="inventory-section animate-fade-up">
                <h2>
                  {label}
                  {lowStockCount > 0 && (
                    <span className="low-stock-badge">{lowStockCount} low stock</span>
                  )}
                </h2>

                <div className="orders-table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price (₹)</th>
                        <th>Stock</th>
                        <th>Threshold</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryItems.map(item => {
                        const isEdited = !!editedItems[item._id];
                        const isLow = item.quantity <= item.threshold;
                        const displayQty = editedItems[item._id]?.quantity ?? item.quantity;
                        const displayThreshold = editedItems[item._id]?.threshold ?? item.threshold;
                        const displayPrice = editedItems[item._id]?.price ?? item.price;

                        return (
                          <tr key={item._id}>
                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.description}</td>
                            <td>
                              <input
                                type="number"
                                className="stock-input"
                                value={displayPrice}
                                onChange={(e) => handleFieldChange(item._id, 'price', e.target.value)}
                                min="0"
                                id={`price-${item._id}`}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className={`stock-input ${isLow ? 'stock-warning' : ''}`}
                                value={displayQty}
                                onChange={(e) => handleFieldChange(item._id, 'quantity', e.target.value)}
                                min="0"
                                id={`qty-${item._id}`}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="stock-input"
                                value={displayThreshold}
                                onChange={(e) => handleFieldChange(item._id, 'threshold', e.target.value)}
                                min="0"
                                id={`threshold-${item._id}`}
                              />
                            </td>
                            <td>
                              {isLow ? (
                                <span className="low-stock-badge">⚠️ Low</span>
                              ) : (
                                <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>✅ OK</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSave(item._id)}
                                disabled={!isEdited || saving[item._id]}
                                id={`save-${item._id}`}
                                style={{ opacity: isEdited ? 1 : 0.4 }}
                              >
                                <FiSave size={14} /> {saving[item._id] ? '...' : 'Save'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Inventory;
