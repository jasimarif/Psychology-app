const API_URL = import.meta.env.VITE_API_URL;

export const psychologistService = {
  async getPsychologists() {
    try {
      const response = await fetch(`${API_URL}/api/psychologists`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch psychologists');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching psychologists:', error);
      throw error;
    }
  },

  async getPsychologistById(id) {
    try {
      const response = await fetch(`${API_URL}/api/psychologists/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch psychologist');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching psychologist:', error);
      throw error;
    }
  }
};
