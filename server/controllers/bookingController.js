import Booking from '../models/Booking.js';
import Psychologist from '../models/Psychologist.js';
import admin from 'firebase-admin';
import zoomService from '../services/zoomService.js';
import emailCalendarService from '../services/emailCalendarService.js';
import stripe from '../config/stripe.js';
import { updateCompletedSessions } from '../utils/sessionCompletionService.js';
import {
  formatDate,
  formatShortDate,
  formatTime24to12,
  formatDateOnly,
  getISOString
} from '../utils/timezone.js';

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Get available time slots for a psychologist on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { psychologistId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const psychologist = await Psychologist.findById(psychologistId);
    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psychologist not found'
      });
    }

    if (!psychologist.availability || !psychologist.availability.schedule || psychologist.availability.schedule.length === 0) {
      return res.json({
        success: true,
        data: {
          availableSlots: [],
          message: 'Psychologist has not configured availability yet'
        }
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    const daySchedule = psychologist.availability.schedule.find(
      s => s.dayOfWeek === dayOfWeek
    );

    if (!daySchedule || !daySchedule.slots || daySchedule.slots.length === 0) {
      return res.json({
        success: true,
        data: {
          availableSlots: [],
          message: 'No availability on this day'
        }
      });
    }

    const allSlots = [];
    const sessionDuration = psychologist.availability.sessionDuration || 60;

    daySchedule.slots.forEach(slot => {
      if (!slot.isActive) return;

      const startMinutes = timeToMinutes(slot.startTime);
      const endMinutes = timeToMinutes(slot.endTime);

      let currentMinutes = startMinutes;
      while (currentMinutes + sessionDuration <= endMinutes) {
        allSlots.push({
          startTime: minutesToTime(currentMinutes),
          endTime: minutesToTime(currentMinutes + sessionDuration)
        });
        currentMinutes += sessionDuration;
      }
    });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      psychologistId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: 'confirmed'
    });

    const bookedTimes = new Set(existingBookings.map(b => b.startTime));
    const availableSlots = allSlots.filter(slot => !bookedTimes.has(slot.startTime));

    res.json({
      success: true,
      data: {
        availableSlots,
        sessionDuration,
        timezone: psychologist.availability.timezone,
        psychologistName: psychologist.name,
        price: psychologist.price
      }
    });
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      psychologistId,
      appointmentDate,
      startTime,
      endTime,
      notes
    } = req.body;

    if (!psychologistId || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const psychologist = await Psychologist.findById(psychologistId);
    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psychologist not found'
      });
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      psychologistId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      startTime,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has just been booked by another user'
      });
    }

    const requestedDate = new Date(appointmentDate);
    const dayOfWeek = requestedDate.getDay();

    const daySchedule = psychologist.availability?.schedule?.find(
      s => s.dayOfWeek === dayOfWeek
    );

    if (!daySchedule) {
      return res.status(400).json({
        success: false,
        message: 'Psychologist is not available on this day'
      });
    }

    const requestedStartMinutes = timeToMinutes(startTime);
    const requestedEndMinutes = timeToMinutes(endTime);

    const isValidSlot = daySchedule.slots.some(slot => {
      if (!slot.isActive) return false;
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      return requestedStartMinutes >= slotStart && requestedEndMinutes <= slotEnd;
    });

    if (!isValidSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not within psychologist\'s available hours'
      });
    }

    const price = typeof psychologist.price === 'number'
      ? psychologist.price
      : parseFloat(psychologist.price.replace(/[^0-9.]/g, ''));

    let userName = req.user.displayName;
    
    if (!userName) {
      try {
        const userRecord = await admin.auth().getUser(req.user.uid);
        userName = userRecord.displayName;
      } catch (error) {
        console.error('Error fetching user from Firebase:', error);
      }
    }

    userName = userName || req.user.email || 'User';

    const booking = await Booking.create({
      userId: req.user.uid,
      userEmail: req.user.email || '',
      userName: userName,
      psychologistId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      timezone: psychologist.availability.timezone,
      price,
      currency: psychologist.currency || 'USD',
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    await booking.populate('psychologistId', 'name title email profileImage');

    // NOTE: Zoom meeting and calendar invites will be created AFTER successful payment
    // See webhooks/stripeWebhook.js for post-payment logic

    /* COMMENTED OUT - Will be handled after payment in webhook
    // Create Zoom meeting and send calendar invites
    try {
      if (zoomService.isAvailable()) {
        const bookingDate = new Date(appointmentDate);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startDateTime = new Date(bookingDate);
        startDateTime.setHours(startHours, startMinutes, 0, 0);

        const endDateTime = new Date(bookingDate);
        endDateTime.setHours(endHours, endMinutes, 0, 0);

        const durationMinutes = Math.round((endDateTime - startDateTime) / 60000);

        // Create Zoom meeting
        const meetingData = {
          topic: `Psychology Session with ${psychologist.name}`,
          startTime: getISOString(bookingDate, startTime),
          duration: durationMinutes
        };

        const zoomMeeting = await zoomService.createMeeting(meetingData);

        booking.zoomMeetingId = zoomMeeting.meetingId;
        booking.zoomJoinUrl = zoomMeeting.joinUrl;
        booking.zoomPassword = zoomMeeting.password;
        booking.calendarIntegrationStatus = 'created';
        await booking.save();

        console.log(`Zoom meeting created: ${zoomMeeting.meetingId}`);

        // Send calendar invites via email
        if (emailCalendarService.isAvailable()) {
          try {
            const userEmail = req.user.email || '';

            const formattedDate = formatDateOnly(appointmentDate);
            const formattedStartTime = formatTime24to12(startTime);
            const formattedEndTime = formatTime24to12(endTime);
            const shortDate = formatShortDate(appointmentDate);

            const inviteDescription = `Session Details:\n\nPsychologist: ${psychologist.name}\nDate: ${formattedDate}\nTime: ${formattedStartTime} - ${formattedEndTime}\n\n${notes ? 'Notes: ' + notes : ''}\n\nZoom Meeting ID: ${zoomMeeting.meetingId}\nPassword: ${zoomMeeting.password}`;

            const recipients = [psychologist.email, userEmail].filter(Boolean);

            if (recipients.length > 0) {
              await emailCalendarService.sendCalendarInvite({
                to: recipients,
                subject: `Therapy Session Scheduled - ${shortDate} at ${formattedStartTime}`,
                eventTitle: `Psychology Session with ${psychologist.name}`,
                eventDescription: inviteDescription,
                startTime: startDateTime,
                endTime: endDateTime,
                location: zoomMeeting.joinUrl,
                formattedDate: formattedDate,
                formattedTime: formattedStartTime
              });

              console.log(`Calendar invites sent to: ${recipients.join(', ')}`);
            }
          } catch (emailError) {
            console.error('Failed to send calendar invites:', emailError.message);
          }
        }
      } else {
        console.warn('Zoom service not available. Booking created without video meeting integration.');
        booking.calendarIntegrationStatus = 'failed';
        await booking.save();
      }
    } catch (integrationError) {
      console.error('Failed to create Zoom meeting:', integrationError.message);
      booking.calendarIntegrationStatus = 'failed';
      await booking.save();
    }
    */ // END COMMENTED OUT SECTION

    // Return booking - client should redirect to payment
    res.status(201).json({
      success: true,
      message: 'Booking created. Please proceed to payment.',
      data: booking,
      requiresPayment: true
    });
  } catch (error) {
    console.error('Error in createBooking:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has already been booked'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.uid !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    await updateCompletedSessions();

    const bookings = await Booking.find({ userId })
      .populate('psychologistId', 'name title email phone profileImage location')
      .sort({ appointmentDate: -1, startTime: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Get all bookings for a psychologist
export const getPsychologistBookings = async (req, res) => {
  try {
    const { psychologistId } = req.params;
    const { status, startDate, endDate } = req.query;

    const psychologist = await Psychologist.findById(psychologistId);
    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psychologist not found'
      });
    }

    if (psychologist.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    await updateCompletedSessions();

    const query = { psychologistId };

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .sort({ appointmentDate: 1, startTime: 1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error in getPsychologistBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const psychologist = await Psychologist.findById(booking.psychologistId);
    const isUser = booking.userId === req.user.uid;
    const isPsychologist = psychologist && psychologist.userId === req.user.uid;

    if (!isUser && !isPsychologist) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`
      });
    }

    const appointmentDateTime = new Date(booking.appointmentDate);
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24 && isUser) {
      return res.status(400).json({
        success: false,
        message: 'Bookings can only be cancelled at least 24 hours before the appointment'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || '';
    booking.cancelledBy = isUser ? 'user' : 'psychologist';
    booking.cancelledAt = new Date();

    // Process refund if payment was made
    let refundResult = null;
    if (booking.paymentStatus === 'paid' && booking.stripePaymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripePaymentIntentId);
        const chargeId = paymentIntent.latest_charge;
        
        const charge = await stripe.charges.retrieve(chargeId, {
          expand: ['balance_transaction']
        });
        
        const balanceTx = charge.balance_transaction;
        const originalAmountCents = charge.amount; 
        const originalCurrency = charge.currency;
        
        const feePercentage = balanceTx.fee / balanceTx.amount;
        
        const refundAmountCents = Math.round(originalAmountCents * (1 - feePercentage));
        const feeAmountCents = originalAmountCents - refundAmountCents;
        
        console.log(`Original: ${originalAmountCents/100} ${originalCurrency.toUpperCase()}, Fee %: ${(feePercentage * 100).toFixed(2)}%, Refund: ${refundAmountCents/100} ${originalCurrency.toUpperCase()}`);
        
        const refund = await stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId,
          amount: refundAmountCents,
          metadata: {
            bookingId: bookingId.toString(),
            reason: reason || 'Session cancelled',
            cancelledBy: isUser ? 'user' : 'psychologist',
            originalAmount: (originalAmountCents / 100).toString(),
            feeDeducted: (feeAmountCents / 100).toString(),
            currency: originalCurrency.toUpperCase()
          }
        });

        booking.paymentStatus = 'refunded';
        booking.stripeRefundId = refund.id;
        booking.refundedAt = new Date();
        booking.refundAmount = refundAmountCents / 100;
        refundResult = {
          id: refund.id,
          amount: refundAmountCents / 100,
          originalAmount: originalAmountCents / 100,
          feeDeducted: feeAmountCents / 100,
          currency: originalCurrency.toUpperCase(),
          status: refund.status
        };
        console.log(`Refund processed: ${refund.id}, Amount: ${refundAmountCents/100} ${originalCurrency.toUpperCase()}`);
      } catch (refundError) {
        console.error('Failed to process refund:', refundError.message);
      }
    }

    await booking.save();

    if (booking.zoomMeetingId && zoomService.isAvailable()) {
      try {
        await zoomService.deleteMeeting(booking.zoomMeetingId);
        console.log(`Zoom meeting ${booking.zoomMeetingId} deleted`);
      } catch (zoomError) {
        console.error('Failed to delete Zoom meeting:', zoomError.message);
      }
    }

    // Send cancellation email notifications
    if (emailCalendarService.isAvailable()) {
      try {
        const userEmail = req.user.email || '';
        const recipients = [psychologist.email, userEmail].filter(Boolean);

        if (recipients.length > 0) {
          const formattedDate = formatDateOnly(booking.appointmentDate);
          const shortDate = formatShortDate(booking.appointmentDate);
          const formattedStartTime = formatTime24to12(booking.startTime);
          
          const appointmentDateTimeForEmail = new Date(booking.appointmentDate);
          const [cancelHours, cancelMinutes] = booking.startTime.split(':').map(Number);
          appointmentDateTimeForEmail.setHours(cancelHours, cancelMinutes, 0, 0);

          const canceledBy = isUser ? 'user' : 'psychologist';
          const canceledByName = isUser ? (req.user.displayName || req.user.email || 'User') : psychologist.name;

          await emailCalendarService.sendCancellationEmail({
            to: recipients,
            subject: `Therapy Session Cancelled - ${shortDate} at ${formattedStartTime} EST`,
            eventTitle: `Psychology Session with ${psychologist.name}`,
            startTime: appointmentDateTimeForEmail,
            reason: reason,
            canceledBy: canceledBy,
            canceledByName: canceledByName,
            formattedDate: formattedDate,
            formattedTime: formattedStartTime
          });

          console.log(`Cancellation emails sent to: ${recipients.join(', ')}`);
        }
      } catch (emailError) {
        console.error('Failed to send cancellation emails:', emailError.message);
      }
    }

    res.json({
      success: true,
      message: booking.stripeRefundId 
        ? 'Booking cancelled and payment refunded successfully' 
        : 'Booking cancelled successfully',
      data: booking,
      refund: refundResult
    });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Reschedule a booking
export const rescheduleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { appointmentDate, startTime, endTime } = req.body;

    if (!appointmentDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: appointmentDate, startTime, endTime'
      });
    }

    const booking = await Booking.findById(bookingId).populate('psychologistId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const psychologist = booking.psychologistId;
    const isUser = booking.userId === req.user.uid;

    if (!isUser) {
      return res.status(403).json({
        success: false,
        message: 'Only the user who booked the session can reschedule it'
      });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${booking.status} booking`
      });
    }

    const currentAppointmentDate = new Date(booking.appointmentDate);
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    currentAppointmentDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const hoursUntilAppointment = (currentAppointmentDate - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return res.status(400).json({
        success: false,
        message: 'Rescheduling is only allowed at least 24 hours before the session'
      });
    }

    const requestedDate = new Date(appointmentDate);
    const dayOfWeek = requestedDate.getDay();

    const daySchedule = psychologist.availability?.schedule?.find(
      s => s.dayOfWeek === dayOfWeek
    );

    if (!daySchedule) {
      return res.status(400).json({
        success: false,
        message: 'Psychologist is not available on this day'
      });
    }

    const requestedStartMinutes = timeToMinutes(startTime);
    const requestedEndMinutes = timeToMinutes(endTime);

    const isValidSlot = daySchedule.slots.some(slot => {
      if (!slot.isActive) return false;
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      return requestedStartMinutes >= slotStart && requestedEndMinutes <= slotEnd;
    });

    if (!isValidSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not within psychologist\'s available hours'
      });
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      _id: { $ne: bookingId }, 
      psychologistId: booking.psychologistId._id,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      startTime,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    booking.appointmentDate = new Date(appointmentDate);
    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    if (booking.zoomMeetingId && zoomService.isAvailable()) {
      try {
        const bookingDate = new Date(appointmentDate);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startDateTime = new Date(bookingDate);
        startDateTime.setHours(startHours, startMinutes, 0, 0);

        const endDateTime = new Date(bookingDate);
        endDateTime.setHours(endHours, endMinutes, 0, 0);

        const durationMinutes = Math.round((endDateTime - startDateTime) / 60000);

        const updateData = {
          topic: `Psychology Session with ${psychologist.name}`,
          startTime: startDateTime,
          duration: durationMinutes
        };

        await zoomService.updateMeeting(booking.zoomMeetingId, updateData);
        console.log(`Zoom meeting ${booking.zoomMeetingId} updated`);

        // Send updated calendar invites via email
        if (emailCalendarService.isAvailable()) {
          try {
            const userEmail = req.user.email || '';

            const inviteDescription = `Session Details:\n\nPsychologist: ${psychologist.name}\nDate: ${bookingDate.toLocaleDateString()}\nTime: ${startTime} - ${endTime}\n\n${booking.notes ? 'Notes: ' + booking.notes : ''}\n\n[RESCHEDULED]\n\nZoom Meeting ID: ${booking.zoomMeetingId}\nPassword: ${booking.zoomPassword}`;

            const recipients = [psychologist.email, userEmail].filter(Boolean);

            if (recipients.length > 0) {
              await emailCalendarService.sendCalendarInvite({
                to: recipients,
                subject: `Therapy Session Rescheduled - ${bookingDate.toLocaleDateString()} at ${startTime}`,
                eventTitle: `Psychology Session with ${psychologist.name} [RESCHEDULED]`,
                eventDescription: inviteDescription,
                startTime: startDateTime,
                endTime: endDateTime,
                location: booking.zoomJoinUrl
              });

              console.log(`Updated calendar invites sent to: ${recipients.join(', ')}`);
            }
          } catch (emailError) {
            console.error('Failed to send updated calendar invites:', emailError.message);
          }
        }
      } catch (zoomError) {
        console.error('Failed to update Zoom meeting:', zoomError.message);
      }
    }

    res.json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error in rescheduleBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule booking',
      error: error.message
    });
  }
};
