import express from 'express';
import { getPsychologists, getPsychologistById } from '../controllers/psychologistController.js';

const router = express.Router();

router.get('/', getPsychologists);
router.get('/:id', getPsychologistById);

export default router;
