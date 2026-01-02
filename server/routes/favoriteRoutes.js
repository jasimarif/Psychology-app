import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites
} from '../controllers/favoriteController.js';

const router = express.Router();

// Favorites routes
router.post('/:userId/favorites', addFavorite);
router.delete('/:userId/favorites', removeFavorite);
router.get('/:userId/favorites', getFavorites);

export default router;
