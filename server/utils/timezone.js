

const EST_TIMEZONE = 'America/New_York';


export const formatDateEST = (date, options = {}) => {
  const defaultOptions = {
    timeZone: EST_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return new Date(date).toLocaleString('en-US', { ...defaultOptions, ...options });
};


export const formatDateOnlyEST = (date) => {
  const dateObj = typeof date === 'string' && date.includes('-') 
    ? new Date(date + 'T12:00:00') 
    : new Date(date);
  
  return dateObj.toLocaleDateString('en-US', {
    timeZone: EST_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


export const formatTimeOnlyEST = (date) => {
  return new Date(date).toLocaleString('en-US', {
    timeZone: EST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};


export const formatShortDateEST = (date) => {
  const dateObj = typeof date === 'string' && date.includes('-') 
    ? new Date(date + 'T12:00:00') 
    : new Date(date);
  
  return dateObj.toLocaleDateString('en-US', {
    timeZone: EST_TIMEZONE,
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};


export const formatTime24to12 = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};


export const createESTDateTime = (dateStr, timeStr) => {
  const date = new Date(dateStr);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const dateTimeString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${timeStr}:00`;
  
  const estDate = new Date(dateTimeString);
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return estDate;
};


export const getISOStringForEST = (date, timeStr) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${timeStr}:00`;
};

export const APP_TIMEZONE = EST_TIMEZONE;

export default {
  formatDateEST,
  formatDateOnlyEST,
  formatTimeOnlyEST,
  formatShortDateEST,
  formatTime24to12,
  createESTDateTime,
  getISOStringForEST,
  APP_TIMEZONE
};
