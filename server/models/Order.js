const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pizzaDetails: {
    base: {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      name: String,
      price: Number
    },
    sauce: {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      name: String,
      price: Number
    },
    cheese: {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      name: String,
      price: Number
    },
    veggies: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      name: String,
      price: Number
    }],
    meat: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
      name: String,
      price: Number
    }]
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    default: ''
  },
  razorpayOrderId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
    default: 'Order Received'
  },
  customerName: {
    type: String
  },
  deliveryAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
