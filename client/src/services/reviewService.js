import { auth } from "@/lib/firebase";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

export const reviewService = {
  // Create a new review
  async createReview(reviewData) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Get reviews for a psychologist
  async getReviewsByPsychologist(psychologistId, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_URL}/api/reviews/psychologist/${psychologistId}?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch reviews');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get user's reviews
  async getUserReviews() {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/reviews/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch reviews');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  // Check if review exists for a booking
  async checkReviewExists(bookingId) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/reviews/check/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check review status');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error checking review:', error);
      throw error;
    }
  },

  // Update a review
  async updateReview(reviewId, reviewData) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update review');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete a review
  async deleteReview(reviewId) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete review');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};
