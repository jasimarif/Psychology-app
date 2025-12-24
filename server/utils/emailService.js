import emailCalendarService from '../services/emailCalendarService.js';
import zoomService from '../services/zoomService.js';
import {
  formatDateOnly,
  formatTime24to12,
  formatShortDate,
  getISOString
} from './timezone.js';


export async function sendConfirmationEmail(booking) {
  const psychologist = booking.psychologistId;

  if (!psychologist || !psychologist.name) {
    throw new Error('Booking must be populated with psychologist data');
  }

  // Create Zoom meeting if not already created
  if (!booking.zoomMeetingId && zoomService.isAvailable()) {
    try {
      const bookingDate = new Date(booking.appointmentDate);
      const [startHours, startMinutes] = booking.startTime.split(':').map(Number);
      const [endHours, endMinutes] = booking.endTime.split(':').map(Number);

      const startDateTime = new Date(bookingDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(bookingDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      const durationMinutes = Math.round((endDateTime - startDateTime) / 60000);

      const meetingData = {
        topic: `Psychology Session with ${psychologist.name}`,
        startTime: getISOString(bookingDate, booking.startTime),
        duration: durationMinutes
      };

      const zoomMeeting = await zoomService.createMeeting(meetingData);

      booking.zoomMeetingId = zoomMeeting.meetingId;
      booking.zoomJoinUrl = zoomMeeting.joinUrl;
      booking.zoomPassword = zoomMeeting.password;
      booking.calendarIntegrationStatus = 'created';
      await booking.save();

      console.log(`Zoom meeting created for booking ${booking._id}: ${zoomMeeting.meetingId}`);
    } catch (zoomError) {
      console.error('Failed to create Zoom meeting:', zoomError);
      booking.calendarIntegrationStatus = 'failed';
      await booking.save();
    }
  }

  // Send confirmation email with calendar invite
  if (emailCalendarService.isAvailable()) {
    try {
      const bookingDate = new Date(booking.appointmentDate);
      const [startHours, startMinutes] = booking.startTime.split(':').map(Number);
      const [endHours, endMinutes] = booking.endTime.split(':').map(Number);

      const startDateTime = new Date(bookingDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(bookingDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      const formattedDate = formatDateOnly(booking.appointmentDate);
      const formattedStartTime = formatTime24to12(booking.startTime);
      const formattedEndTime = formatTime24to12(booking.endTime);
      const shortDate = formatShortDate(booking.appointmentDate);

      let inviteDescription = `Session Details:\n\nPsychologist: ${psychologist.name}\nDate: ${formattedDate}\nTime: ${formattedStartTime} - ${formattedEndTime}\n\n`;

      if (booking.notes) {
        inviteDescription += `Notes: ${booking.notes}\n\n`;
      }

      if (booking.zoomMeetingId) {
        inviteDescription += `Zoom Meeting ID: ${booking.zoomMeetingId}\nPassword: ${booking.zoomPassword}`;
      }

      const recipients = [psychologist.email, booking.userEmail].filter(Boolean);

      if (recipients.length > 0) {
        await emailCalendarService.sendCalendarInvite({
          to: recipients,
          subject: `Therapy Session Confirmed - ${shortDate} at ${formattedStartTime}`,
          eventTitle: `Psychology Session with ${psychologist.name}`,
          eventDescription: inviteDescription,
          startTime: startDateTime,
          endTime: endDateTime,
          location: booking.zoomJoinUrl || 'TBD',
          formattedDate: formattedDate,
          formattedTime: formattedStartTime
        });

        console.log(`Confirmation email sent for booking ${booking._id} to: ${recipients.join(', ')}`);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      throw emailError;
    }
  } else {
    console.warn('Email service not available - confirmation email not sent');
  }
}
