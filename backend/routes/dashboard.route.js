import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.use(protectRoute); // Protect all routes below this middleware

router.get('/', getDashboardData);

export default router;

