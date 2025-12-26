import express from 'express';
import { addAddress, getUserAddresses } from '../controllers/address.controller.js';

const router = express.Router();

router.post('/add-address', addAddress)
router.get('/', getUserAddresses)

export default router;