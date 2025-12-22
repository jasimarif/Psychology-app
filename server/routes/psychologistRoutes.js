import express from 'express';
import { getPsychologists } from '../controllers/psychologistController.js';

const router = express.Router();

router.get('/', getPsychologists);

export default router;
