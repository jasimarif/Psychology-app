const API_URL = import.meta.env.VITE_API_URL;

export const favoritesService = {
  async addFavorite(userId, psychologistId) {
    try {
      const response = await fetch(`${API_URL}/api/favorites/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ psychologistId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add favorite');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId, psychologistId) {
    try {
      const response = await fetch(`${API_URL}/api/favorites/${userId}/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ psychologistId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove favorite');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  async getFavorites(userId) {
    try {
      const response = await fetch(`${API_URL}/api/favorites/${userId}/favorites`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch favorites');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }
};
