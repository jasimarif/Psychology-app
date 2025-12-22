import pkg from 'nodemailer';
const { createTransport } = pkg;
import ical from 'ical-generator';



class EmailCalendarService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  
  initialize() {
    try {
      const emailHost = process.env.EMAIL_HOST;
      const emailPort = process.env.EMAIL_PORT;
      const emailUser = process.env.EMAIL_USER;
      const emailPassword = process.env.EMAIL_PASSWORD;
      const emailFrom = process.env.EMAIL_FROM || emailUser;

      if (!emailHost || !emailUser || !emailPassword) {
        console.warn('Email Calendar Service: Missing email credentials. Calendar invites will not be sent.');
        return false;
      }

      this.transporter = createTransport({
        host: emailHost,
        port: parseInt(emailPort) || 587,
        secure: parseInt(emailPort) === 465, 
        auth: {
          user: emailUser,
          pass: emailPassword
        }
      });

      this.emailFrom = emailFrom;
      this.initialized = true;

      console.log('Email Calendar Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Email Calendar Service:', error.message);
      return false;
    }
  }


  async sendCalendarInvite(eventData) {
    if (!this.initialized) {
      const success = this.initialize();
      if (!success) {
        throw new Error('Email Calendar Service is not initialized. Check email credentials.');
      }
    }

    try {
      const {
        to,
        subject,
        eventTitle,
        eventDescription,
        startTime,
        endTime,
        location,
        timezone
      } = eventData;

      const calendar = ical({ name: 'Psychology Portal - Session Booking' });

      calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: eventTitle,
        description: eventDescription,
        location: location || '',
        timezone: timezone || 'America/New_York',
        url: location, 
        organizer: {
          name: 'Psychology Portal',
          email: this.emailFrom
        },
        method: 'REQUEST',
        status: 'CONFIRMED'
      });

      const icsContent = calendar.toString();

      const recipients = Array.isArray(to) ? to.join(', ') : to;

      // Email HTML body
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .details { background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🗓️ Therapy Session Scheduled</h1>
            </div>
            <div class="content">
              <h2>${eventTitle}</h2>
              <p>Your therapy session has been scheduled. Please find the details below:</p>

              <div class="details">
                <p><strong>📅 Date & Time:</strong><br>${new Date(startTime).toLocaleString('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>⏱️ Duration:</strong><br>${Math.round((new Date(endTime) - new Date(startTime)) / 60000)} minutes</p>
                ${eventDescription ? `<p><strong>📝 Notes:</strong><br>${eventDescription}</p>` : ''}
              </div>

              ${location ? `
                <p><strong>Join via Zoom:</strong></p>
                <a href="${location}" class="button">Join Zoom Meeting</a>
                <p style="font-size: 14px; color: #666;">Or copy and paste this link: <br><a href="${location}">${location}</a></p>
              ` : ''}

              <p><strong>📎 Calendar Invite:</strong><br>This email includes a calendar invitation (.ics file) that you can add to your calendar app (Google Calendar, Outlook, Apple Calendar, etc.).</p>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
            </div>
            <div class="footer">
              <p>Psychology Portal - Your Mental Wellness Partner</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email with .ics attachment
      const mailOptions = {
        from: `"Psychology Portal" <${this.emailFrom}>`,
        to: recipients,
        subject: subject,
        html: htmlBody,
        icalEvent: {
          filename: 'session-invite.ics',
          method: 'REQUEST',
          content: icsContent
        },
        alternatives: [{
          contentType: 'text/calendar; method=REQUEST',
          content: Buffer.from(icsContent)
        }]
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        recipients: recipients
      };
    } catch (error) {
      console.error('Error sending calendar invite:', error.message);
      throw new Error(`Failed to send calendar invite: ${error.message}`);
    }
  }

  
  async sendCancellationEmail(eventData) {
    if (!this.initialized) {
      const success = this.initialize();
      if (!success) {
        throw new Error('Email Calendar Service is not initialized. Check email credentials.');
      }
    }

    try {
      const {
        to,
        subject,
        eventTitle,
        startTime,
        reason
      } = eventData;

      const recipients = Array.isArray(to) ? to.join(', ') : to;

      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Session Cancelled</h1>
            </div>
            <div class="content">
              <h2>${eventTitle}</h2>
              <p>The therapy session scheduled for <strong>${new Date(startTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong> has been cancelled.</p>

              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}

              <p style="margin-top: 30px;">If you'd like to reschedule, please contact us or book a new session through the portal.</p>
            </div>
            <div class="footer">
              <p>Psychology Portal - Your Mental Wellness Partner</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Psychology Portal" <${this.emailFrom}>`,
        to: recipients,
        subject: subject,
        html: htmlBody
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        recipients: recipients
      };
    } catch (error) {
      console.error('Error sending cancellation email:', error.message);
      throw new Error(`Failed to send cancellation email: ${error.message}`);
    }
  }

  
  isAvailable() {
    return this.initialized || this.initialize();
  }
}

const emailCalendarService = new EmailCalendarService();
export default emailCalendarService;
