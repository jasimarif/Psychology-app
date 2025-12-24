import express from 'express';
import {
  createCheckoutSession,
  getCheckoutSession,
  refundPayment
} from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/create-checkout-session', createCheckoutSession);

router.get('/session/:sessionId', getCheckoutSession);

router.post('/refund', refundPayment);

export default router;
