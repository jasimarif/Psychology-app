import { auth } from "@/lib/firebase";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

export const bookingService = {
  async getAvailableSlots(psychologistId, date) {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/psychologists/${psychologistId}/available-slots?date=${date}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch available slots');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  async createBooking(bookingData) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async getUserBookings(userId) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/bookings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch bookings');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  async cancelBooking(bookingId, reason) {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel booking');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
};
