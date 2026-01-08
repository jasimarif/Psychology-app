import express from 'express';
import { getPsychologists, getPsychologistById, getRecommendedPsychologists } from '../controllers/psychologistController.js';

const router = express.Router();

router.get('/', getPsychologists);
router.get('/recommendations/:userId', getRecommendedPsychologists);
router.get('/:id', getPsychologistById);

export default router;
