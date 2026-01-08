import Psychologist from '../models/Psychologist.js';
import Profile from '../models/Profile.js';
import { getRecommendations } from '../services/recommendationService.js';

const getPsychologists = async (req, res) => {
  try {
    const psychologists = await Psychologist.find({ isActive: true });
    res.json({
      success: true,
      data: psychologists
    });
  } catch (error) {
    console.error('Error fetching psychologists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch psychologists'
    });
  }
};

const getPsychologistById = async (req, res) => {
  try {
    const { id } = req.params;
    const psychologist = await Psychologist.findById(id);

    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psychologist not found'
      });
    }

    res.json({
      success: true,
      data: psychologist
    });
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch psychologist'
    });
  }
};

const getRecommendedPsychologists = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    // Get user profile
    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please complete the questionnaire first.'
      });
    }

    // Get all active psychologists
    const psychologists = await Psychologist.find({ isActive: true });

    // Get recommendations based on profile
    const recommendations = getRecommendations(userProfile, psychologists, {
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: recommendations,
      profileComplete: true,
      totalPsychologists: psychologists.length,
      recommendedCount: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
};

export {
  getPsychologists,
  getPsychologistById,
  getRecommendedPsychologists
};
