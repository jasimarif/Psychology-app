import Favorite from '../models/Favorite.js';

// Add psychologist to favorites
export const addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { psychologistId } = req.body;

    if (!userId || !psychologistId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and Psychologist ID are required' 
      });
    }

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      // Create new favorites document for user
      favorite = await Favorite.create({
        userId,
        psychologists: [psychologistId]
      });
    } else {
      // Check if already in favorites
      if (favorite.psychologists.includes(psychologistId)) {
        return res.status(400).json({
          success: false,
          message: 'Psychologist already in favorites'
        });
      }

      // Add to favorites array
      favorite.psychologists.push(psychologistId);
      await favorite.save();
    }

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      data: favorite.psychologists
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      error: error.message
    });
  }
};

// Remove psychologist from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { psychologistId } = req.body;

    if (!userId || !psychologistId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and Psychologist ID are required' 
      });
    }

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorites not found'
      });
    }

    // Remove from favorites array
    favorite.psychologists = favorite.psychologists.filter(
      id => id !== psychologistId
    );
    await favorite.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      data: favorite.psychologists
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message
    });
  }
};

// Get user's favorite psychologists
export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      data: favorite.psychologists || []
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message
    });
  }
};
