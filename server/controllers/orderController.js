const Order = require('../models/Order');
const { deductStock, checkStockLevels } = require('../utils/stockChecker');

exports.createOrder = async (req, res) => {
  try {
    const { pizzaDetails, totalPrice, paymentId, razorpayOrderId, deliveryAddress } = req.body;

    const order = new Order({
      user: req.user._id,
      pizzaDetails,
      totalPrice,
      paymentId,
      razorpayOrderId,
      customerName: req.user.name,
      deliveryAddress,
      status: 'Order Received'
    });

    await order.save();

    const itemIds = await deductStock(pizzaDetails);

    await checkStockLevels(itemIds);

    res.status(201).json({ 
      message: 'Order placed successfully!', 
      order 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: `Order status updated to "${status}".`, order });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating order status.' });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $ne: 'Delivered' } });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const statusCounts = {
      'Order Received': await Order.countDocuments({ status: 'Order Received' }),
      'In the Kitchen': await Order.countDocuments({ status: 'In the Kitchen' }),
      'Sent to Delivery': await Order.countDocuments({ status: 'Sent to Delivery' }),
      'Delivered': deliveredOrders
    };

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      statusCounts
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error fetching order stats.' });
  }
};
