import { auth } from '../lib/firebase';

const API_URL = import.meta.env.VITE_API_URL;


export const createCheckoutSession = async (bookingId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to create checkout session');
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};


export const getCheckoutSession = async (sessionId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/api/payment/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to retrieve session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
};


export const refundPayment = async (bookingId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/api/payment/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process refund');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};
