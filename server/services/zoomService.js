import axios from 'axios';



class ZoomService {
  constructor() {
    this.baseURL = 'https://api.zoom.us/v2';
    this.accessToken = null;
    this.tokenExpiry = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      const accountId = process.env.ZOOM_ACCOUNT_ID;
      const clientId = process.env.ZOOM_CLIENT_ID;
      const clientSecret = process.env.ZOOM_CLIENT_SECRET;

      if (!accountId || !clientId || !clientSecret) {
        console.warn('Zoom Service: Missing Zoom credentials. Video integration disabled.');
        return false;
      }

      await this.getAccessToken();
      this.initialized = true;
      console.log('Zoom Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Zoom Service:', error.message);
      return false;
    }
  }


  async getAccessToken() {
    try {
      const accountId = process.env.ZOOM_ACCOUNT_ID;
      const clientId = process.env.ZOOM_CLIENT_ID;
      const clientSecret = process.env.ZOOM_CLIENT_SECRET;

      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
        {},
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Zoom access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Zoom');
    }
  }

  
  async ensureValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry - 60000) {
      await this.getAccessToken();
    }
  }

 
  async createMeeting(meetingData) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Zoom Service is not initialized. Check Zoom credentials.');
      }
    }

    try {
      await this.ensureValidToken();

      const { topic, startTime, duration, timezone, agenda } = meetingData;

      const userId = 'me'; 

      const meetingPayload = {
        topic,
        type: 2, 
        start_time: startTime,
        duration,
        timezone,
        agenda: agenda || '',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true, 
          audio: 'both',
          auto_recording: 'none',
          approval_type: 0 
        }
      };

      const response = await axios.post(
        `${this.baseURL}/users/${userId}/meetings`,
        meetingPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const meeting = response.data;

      return {
        meetingId: meeting.id.toString(),
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url,
        password: meeting.password || meeting.encrypted_password,
        meetingNumber: meeting.id
      };
    } catch (error) {
      console.error('Error creating Zoom meeting:', error.response?.data || error.message);
      throw new Error(`Failed to create Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }

 
  async updateMeeting(meetingId, updateData) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Zoom Service is not initialized. Check Zoom credentials.');
      }
    }

    try {
      await this.ensureValidToken();

      const { topic, startTime, duration, timezone, agenda } = updateData;

      const meetingPayload = {
        ...(topic && { topic }),
        ...(startTime && { start_time: startTime }),
        ...(duration && { duration }),
        ...(timezone && { timezone }),
        ...(agenda && { agenda })
      };

      await axios.patch(
        `${this.baseURL}/meetings/${meetingId}`,
        meetingPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const response = await axios.get(
        `${this.baseURL}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      const meeting = response.data;

      return {
        meetingId: meeting.id.toString(),
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url,
        password: meeting.password || meeting.encrypted_password,
        meetingNumber: meeting.id
      };
    } catch (error) {
      console.error('Error updating Zoom meeting:', error.response?.data || error.message);
      throw new Error(`Failed to update Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }

 
  async deleteMeeting(meetingId) {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Zoom Service is not initialized. Check Zoom credentials.');
      }
    }

    try {
      await this.ensureValidToken();

      await axios.delete(
        `${this.baseURL}/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      console.log(`Zoom meeting ${meetingId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting Zoom meeting:', error.response?.data || error.message);
      throw new Error(`Failed to delete Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }

  async isAvailable() {
    if (this.initialized) return true;
    return await this.initialize();
  }
}

const zoomService = new ZoomService();
export default zoomService;
