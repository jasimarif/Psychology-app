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

export {
  getPsychologists,
  getPsychologistById
};
