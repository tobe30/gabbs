import express from 'express';
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

//order routes
router.post('/place-order', createOrder);
router.get('/', getUserOrders)
router.patch('/update-status', protectRoute, updateOrderStatus)
router.get('/all-orders', protectRoute, getAllOrders)

export default router;