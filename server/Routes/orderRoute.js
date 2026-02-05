const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus, getUserOrders } = require('../Controller/orderController');

router.post('/api/orders', createOrder);
router.get('/api/orders', getAllOrders);
router.patch('/api/orders/:id/status', updateOrderStatus);
router.get('/api/users/:userId/orders', getUserOrders);

module.exports = router;
