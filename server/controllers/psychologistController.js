import Psychologist from '../models/Psychologist.js';

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

export {
  getPsychologists
};
