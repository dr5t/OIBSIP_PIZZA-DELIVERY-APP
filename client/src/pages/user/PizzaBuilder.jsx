import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import API from '../../api/axios';

const STEP_LABELS = ['Base', 'Sauce', 'Cheese', 'Toppings', 'Review'];
const CATEGORY_EMOJIS = {
  base: { 'Thin Crust': '🫓', 'Thick Crust': '🍞', 'Stuffed Crust': '🧀', 'Gluten-Free': '🌾', 'Whole Wheat': '🌿' },
  sauce: { 'Classic Tomato': '🍅', 'BBQ': '🔥', 'Pesto': '🌿', 'White Garlic': '🧄', 'Buffalo': '🌶️' },
  cheese: { 'Mozzarella': '🧀', 'Cheddar': '🟡', 'Parmesan': '🫕', 'Vegan Cheese': '🌱' },
  veggie: { 'Bell Peppers': '🫑', 'Mushrooms': '🍄', 'Onions': '🧅', 'Olives': '🫒', 'Jalapeños': '🌶️', 'Sweet Corn': '🌽' },
  meat: { 'Pepperoni': '🍖', 'Chicken Tikka': '🍗', 'Italian Sausage': '🌭', 'Bacon Strips': '🥓' }
};

const PizzaBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedMeat, setSelectedMeat] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await API.get('/inventory/available');
        setInventory(data.grouped);
      } catch (error) {
        toast.error('Failed to load ingredients. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const getEmoji = (category, name) => {
    return CATEGORY_EMOJIS[category]?.[name] || '🍕';
  };

  const toggleTopping = (item, type) => {
    if (type === 'veggie') {
      setSelectedVeggies(prev => 
        prev.find(v => v._id === item._id)
          ? prev.filter(v => v._id !== item._id)
          : [...prev, item]
      );
    } else {
      setSelectedMeat(prev =>
        prev.find(m => m._id === item._id)
          ? prev.filter(m => m._id !== item._id)
          : [...prev, item]
      );
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedBase) total += selectedBase.price;
    if (selectedSauce) total += selectedSauce.price;
    if (selectedCheese) total += selectedCheese.price;
    selectedVeggies.forEach(v => total += v.price);
    selectedMeat.forEach(m => total += m.price);
    return total;
  };

  const canProceed = () => {
    switch(step) {
      case 0: return !!selectedBase;
      case 1: return !!selectedSauce;
      case 2: return !!selectedCheese;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleProceedToCheckout = () => {
    const pizzaData = {
      base: { item: selectedBase._id, name: selectedBase.name, price: selectedBase.price },
      sauce: { item: selectedSauce._id, name: selectedSauce.name, price: selectedSauce.price },
      cheese: { item: selectedCheese._id, name: selectedCheese.name, price: selectedCheese.price },
      veggies: selectedVeggies.map(v => ({ item: v._id, name: v.name, price: v.price })),
      meat: selectedMeat.map(m => ({ item: m._id, name: m.name, price: m.price })),
    };
    const totalPrice = calculateTotal();
    sessionStorage.setItem('pizza_order', JSON.stringify({ pizzaData, totalPrice }));
    navigate('/checkout');
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
        <div className="builder-wrapper">
          <div className="builder-progress">
            {STEP_LABELS.map((label, idx) => (
              <div key={idx} className="progress-step">
                <div className={`step-circle ${idx === step ? 'active' : ''} ${idx < step ? 'completed' : ''}`}>
                  {idx < step ? <FiCheck size={14} /> : idx + 1}
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <div className={`step-line ${idx < step ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="builder-step">
              <h2>🫓 Choose Your Pizza Base</h2>
              <p className="step-subtitle">Select one of our handcrafted bases</p>
              <div className="options-grid">
                {inventory?.base?.map(item => (
                  <div 
                    key={item._id}
                    className={`option-card ${selectedBase?._id === item._id ? 'selected' : ''}`}
                    onClick={() => setSelectedBase(item)}
                    id={`base-${item._id}`}
                  >
                    <span className="option-emoji">{getEmoji('base', item.name)}</span>
                    <div className="option-name">{item.name}</div>
                    <div className="option-desc">{item.description}</div>
                    <div className="option-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="builder-step">
              <h2>🍅 Choose Your Sauce</h2>
              <p className="step-subtitle">Pick your favorite sauce</p>
              <div className="options-grid">
                {inventory?.sauce?.map(item => (
                  <div 
                    key={item._id}
                    className={`option-card ${selectedSauce?._id === item._id ? 'selected' : ''}`}
                    onClick={() => setSelectedSauce(item)}
                    id={`sauce-${item._id}`}
                  >
                    <span className="option-emoji">{getEmoji('sauce', item.name)}</span>
                    <div className="option-name">{item.name}</div>
                    <div className="option-desc">{item.description}</div>
                    <div className="option-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="builder-step">
              <h2>🧀 Select Your Cheese</h2>
              <p className="step-subtitle">Choose the perfect cheese</p>
              <div className="options-grid">
                {inventory?.cheese?.map(item => (
                  <div 
                    key={item._id}
                    className={`option-card ${selectedCheese?._id === item._id ? 'selected' : ''}`}
                    onClick={() => setSelectedCheese(item)}
                    id={`cheese-${item._id}`}
                  >
                    <span className="option-emoji">{getEmoji('cheese', item.name)}</span>
                    <div className="option-name">{item.name}</div>
                    <div className="option-desc">{item.description}</div>
                    <div className="option-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="builder-step">
              <h2>🥗 Add Your Toppings</h2>
              <p className="step-subtitle">Select veggies and meat (optional)</p>

              {inventory?.veggie?.length > 0 && (
                <>
                  <h3 style={{ margin: '20px 0 12px', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>🥬 Veggies</h3>
                  <div className="options-grid">
                    {inventory.veggie.map(item => (
                      <div 
                        key={item._id}
                        className={`option-card ${selectedVeggies.find(v => v._id === item._id) ? 'selected' : ''}`}
                        onClick={() => toggleTopping(item, 'veggie')}
                        id={`veggie-${item._id}`}
                      >
                        <span className="option-emoji">{getEmoji('veggie', item.name)}</span>
                        <div className="option-name">{item.name}</div>
                        <div className="option-desc">{item.description}</div>
                        <div className="option-price">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {inventory?.meat?.length > 0 && (
                <>
                  <h3 style={{ margin: '24px 0 12px', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>🍖 Meat</h3>
                  <div className="options-grid">
                    {inventory.meat.map(item => (
                      <div 
                        key={item._id}
                        className={`option-card ${selectedMeat.find(m => m._id === item._id) ? 'selected' : ''}`}
                        onClick={() => toggleTopping(item, 'meat')}
                        id={`meat-${item._id}`}
                      >
                        <span className="option-emoji">{getEmoji('meat', item.name)}</span>
                        <div className="option-name">{item.name}</div>
                        <div className="option-desc">{item.description}</div>
                        <div className="option-price">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="builder-step">
              <h2>📋 Review Your Pizza</h2>
              <p className="step-subtitle">Everything looks delicious!</p>

              <div className="order-summary">
                <h3>🍕 Your Custom Pizza</h3>
                <div className="summary-item">
                  <span className="label">Base</span>
                  <span className="value">{selectedBase?.name} — ₹{selectedBase?.price}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Sauce</span>
                  <span className="value">{selectedSauce?.name} — ₹{selectedSauce?.price}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Cheese</span>
                  <span className="value">{selectedCheese?.name} — ₹{selectedCheese?.price}</span>
                </div>
                {selectedVeggies.length > 0 && (
                  <div className="summary-item">
                    <span className="label">Veggies</span>
                    <span className="value">
                      {selectedVeggies.map(v => v.name).join(', ')} — ₹{selectedVeggies.reduce((s, v) => s + v.price, 0)}
                    </span>
                  </div>
                )}
                {selectedMeat.length > 0 && (
                  <div className="summary-item">
                    <span className="label">Meat</span>
                    <span className="value">
                      {selectedMeat.map(m => m.name).join(', ')} — ₹{selectedMeat.reduce((s, m) => s + m.price, 0)}
                    </span>
                  </div>
                )}
                <div className="summary-total">
                  <span>Total</span>
                  <span className="amount">₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="builder-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => step === 0 ? navigate('/dashboard') : setStep(step - 1)}
              id="btn-builder-back"
            >
              <FiArrowLeft /> {step === 0 ? 'Dashboard' : 'Back'}
            </button>

            {step < 4 ? (
              <button 
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                id="btn-builder-next"
              >
                Next <FiArrowRight />
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleProceedToCheckout}
                id="btn-proceed-checkout"
              >
                Proceed to Payment 💳
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
