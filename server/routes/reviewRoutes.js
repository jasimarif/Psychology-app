import express from 'express';
import {
  createReview,
  getReviewsByPsychologist,
  getUserReviews,
  checkReviewExists,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - get reviews for a psychologist
router.get('/psychologist/:psychologistId', getReviewsByPsychologist);

// Protected routes
router.post('/', verifyToken, createReview);
router.get('/user', verifyToken, getUserReviews);
router.get('/check/:bookingId', verifyToken, checkReviewExists);
router.put('/:reviewId', verifyToken, updateReview);
router.delete('/:reviewId', verifyToken, deleteReview);

export default router;
