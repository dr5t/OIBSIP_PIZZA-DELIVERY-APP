const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment
} = require('../controllers/paymentController');

router.post('/create-order', auth, createPaymentOrder);
router.post('/verify', auth, verifyPayment);

module.exports = router;
