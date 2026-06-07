const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  getAllItems,
  getAvailableItems,
  updateItem,
  seedInventory,
  getStats
} = require('../controllers/inventoryController');

router.get('/available', auth, getAvailableItems);

router.get('/', auth, adminAuth, getAllItems);
router.put('/:id', auth, adminAuth, updateItem);
router.post('/seed', seedInventory);
router.get('/stats', auth, adminAuth, getStats);

module.exports = router;
