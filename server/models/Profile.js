import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: ''
  },
  // Step 1: Therapy Type & Basic Info
  therapyType: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: 'Pakistan'
  },
  age: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  // Step 2: What You're Looking For
  therapyReasons: {
    type: [String],
    default: []
  },
  preferredLanguages: {
    type: [String],
    default: []
  },
  // Step 3: Preferences
  preferredTherapist: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'profile'
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
