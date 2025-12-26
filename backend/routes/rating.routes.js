import express from 'express';
import { addRating, getProductRatings, getUserRatings } from '../controllers/rating.controller.js';

const router = express.Router();

router.post('/add-rating', addRating)
router.get('/', getUserRatings)
router.get("/product-rating/:productId", getProductRatings);



export default router;