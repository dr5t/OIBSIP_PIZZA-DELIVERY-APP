const Inventory = require('../models/Inventory');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    
    const grouped = {
      base: items.filter(i => i.category === 'base'),
      sauce: items.filter(i => i.category === 'sauce'),
      cheese: items.filter(i => i.category === 'cheese'),
      veggie: items.filter(i => i.category === 'veggie'),
      meat: items.filter(i => i.category === 'meat')
    };

    res.json({ items, grouped });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error fetching inventory.' });
  }
};

exports.getAvailableItems = async (req, res) => {
  try {
    const items = await Inventory.find({ quantity: { $gt: 0 }, isAvailable: true })
      .sort({ category: 1, name: 1 });
    
    const grouped = {
      base: items.filter(i => i.category === 'base'),
      sauce: items.filter(i => i.category === 'sauce'),
      cheese: items.filter(i => i.category === 'cheese'),
      veggie: items.filter(i => i.category === 'veggie'),
      meat: items.filter(i => i.category === 'meat')
    };

    res.json({ items, grouped });
  } catch (error) {
    console.error('Get available items error:', error);
    res.status(500).json({ message: 'Server error fetching available items.' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { quantity, threshold, price, isAvailable } = req.body;
    
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { 
        ...(quantity !== undefined && { quantity }),
        ...(threshold !== undefined && { threshold }),
        ...(price !== undefined && { price }),
        ...(isAvailable !== undefined && { isAvailable })
      },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    res.json({ message: 'Item updated successfully.', item });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Server error updating inventory.' });
  }
};

exports.seedInventory = async (req, res) => {
  try {
    const count = await Inventory.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Inventory already seeded. Delete existing data first.' });
    }

    const seedData = [
      { category: 'base', name: 'Thin Crust', description: 'Classic thin and crispy base', quantity: 100, price: 120, threshold: 20 },
      { category: 'base', name: 'Thick Crust', description: 'Soft and fluffy thick base', quantity: 100, price: 140, threshold: 20 },
      { category: 'base', name: 'Stuffed Crust', description: 'Crust filled with cheese', quantity: 80, price: 180, threshold: 20 },
      { category: 'base', name: 'Gluten-Free', description: 'Made with rice and tapioca flour', quantity: 60, price: 200, threshold: 15 },
      { category: 'base', name: 'Whole Wheat', description: 'Healthy whole grain base', quantity: 80, price: 150, threshold: 20 },

      { category: 'sauce', name: 'Classic Tomato', description: 'Rich tomato marinara sauce', quantity: 150, price: 30, threshold: 25 },
      { category: 'sauce', name: 'BBQ', description: 'Smoky barbecue sauce', quantity: 120, price: 40, threshold: 20 },
      { category: 'sauce', name: 'Pesto', description: 'Fresh basil pesto', quantity: 100, price: 50, threshold: 20 },
      { category: 'sauce', name: 'White Garlic', description: 'Creamy garlic alfredo sauce', quantity: 100, price: 45, threshold: 20 },
      { category: 'sauce', name: 'Buffalo', description: 'Spicy buffalo hot sauce', quantity: 90, price: 40, threshold: 15 },

      { category: 'cheese', name: 'Mozzarella', description: 'Classic stretchy mozzarella', quantity: 200, price: 60, threshold: 30 },
      { category: 'cheese', name: 'Cheddar', description: 'Sharp aged cheddar', quantity: 150, price: 70, threshold: 25 },
      { category: 'cheese', name: 'Parmesan', description: 'Aged Italian parmesan', quantity: 120, price: 80, threshold: 20 },
      { category: 'cheese', name: 'Vegan Cheese', description: 'Plant-based cheese alternative', quantity: 80, price: 90, threshold: 15 },

      { category: 'veggie', name: 'Bell Peppers', description: 'Colorful sliced peppers', quantity: 200, price: 25, threshold: 30 },
      { category: 'veggie', name: 'Mushrooms', description: 'Fresh sliced mushrooms', quantity: 180, price: 30, threshold: 25 },
      { category: 'veggie', name: 'Onions', description: 'Caramelized onion rings', quantity: 200, price: 20, threshold: 30 },
      { category: 'veggie', name: 'Olives', description: 'Sliced black olives', quantity: 150, price: 35, threshold: 25 },
      { category: 'veggie', name: 'Jalapeños', description: 'Spicy sliced jalapeños', quantity: 120, price: 25, threshold: 20 },
      { category: 'veggie', name: 'Sweet Corn', description: 'Golden sweet corn kernels', quantity: 160, price: 25, threshold: 25 },

      { category: 'meat', name: 'Pepperoni', description: 'Classic spiced pepperoni', quantity: 150, price: 70, threshold: 25 },
      { category: 'meat', name: 'Chicken Tikka', description: 'Tandoori spiced chicken', quantity: 120, price: 80, threshold: 20 },
      { category: 'meat', name: 'Italian Sausage', description: 'Seasoned pork sausage', quantity: 100, price: 75, threshold: 20 },
      { category: 'meat', name: 'Bacon Strips', description: 'Crispy smoked bacon', quantity: 100, price: 85, threshold: 20 }
    ];

    await Inventory.insertMany(seedData);

    res.status(201).json({ 
      message: `Inventory seeded with ${seedData.length} items successfully!`,
      count: seedData.length
    });
  } catch (error) {
    console.error('Seed inventory error:', error);
    res.status(500).json({ message: 'Server error seeding inventory.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const items = await Inventory.find();
    const lowStockItems = items.filter(i => i.quantity <= i.threshold);
    const totalItems = items.length;
    const totalStock = items.reduce((sum, i) => sum + i.quantity, 0);

    const categoryStats = {};
    ['base', 'sauce', 'cheese', 'veggie', 'meat'].forEach(cat => {
      const catItems = items.filter(i => i.category === cat);
      categoryStats[cat] = {
        total: catItems.length,
        totalStock: catItems.reduce((sum, i) => sum + i.quantity, 0),
        lowStock: catItems.filter(i => i.quantity <= i.threshold).length
      };
    });

    res.json({
      totalItems,
      totalStock,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      categoryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats.' });
  }
};
