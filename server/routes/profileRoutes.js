import express from 'express';
import {
  saveProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';

const router = express.Router();

router.post('/', saveProfile);

router.get('/:userId', getProfile);

router.put('/:userId', updateProfile);

router.delete('/:userId', deleteProfile);

export default router;
