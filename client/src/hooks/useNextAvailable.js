import { useState, useEffect } from 'react';
import { bookingService } from '@/services/bookingService';
import { formatTime24to12, formatDateOnly } from '@/lib/timezone';

export const useNextAvailable = (psychologistId) => {
  const [nextAvailable, setNextAvailable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!psychologistId) {
      setLoading(false);
      return;
    }

    const fetchNextAvailable = async () => {
      try {
        setLoading(true);
        setError(null);
        const slot = await bookingService.getNextAvailableSlot(psychologistId);
        setNextAvailable(slot);
      } catch (err) {
        console.error('Error fetching next available slot:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNextAvailable();
  }, [psychologistId]);

  const getDisplayText = () => {
    if (loading) return 'Checking availability...';
    if (error || !nextAvailable) return 'No slots available';

    const time = formatTime24to12(nextAvailable.startTime);

    if (nextAvailable.isToday) {
      return `Today, ${time}`;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = nextAvailable.date.toDateString() === tomorrow.toDateString();

    if (isTomorrow) {
      return `Tomorrow, ${time}`;
    }

    const dayName = nextAvailable.date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = nextAvailable.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return `${dayName}, ${monthDay}, ${time}`;
  };

  return {
    nextAvailable,
    loading,
    error,
    displayText: getDisplayText(),
    hasAvailability: !loading && !error && nextAvailable !== null
  };
};

export default useNextAvailable;
