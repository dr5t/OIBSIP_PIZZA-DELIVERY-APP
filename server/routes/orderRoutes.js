const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);

router.get('/', auth, adminAuth, getAllOrders);
router.get('/stats', auth, adminAuth, getOrderStats);
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router;
