import express from 'express';
import {
  getAvailableSlots,
  createBooking,
  getUserBookings,
  getPsychologistBookings,
  cancelBooking,
  confirmBooking,
  rescheduleBooking
} from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/psychologists/:psychologistId/available-slots', getAvailableSlots);

router.post('/', verifyToken, createBooking);
router.get('/user/:userId', verifyToken, getUserBookings);
router.get('/psychologist/:psychologistId', verifyToken, getPsychologistBookings);
router.patch('/:bookingId/cancel', verifyToken, cancelBooking);
router.patch('/:bookingId/confirm', verifyToken, confirmBooking);
router.patch('/:bookingId/reschedule', verifyToken, rescheduleBooking);

export default router;
