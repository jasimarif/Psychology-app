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
  relationshipStatus: {
    type: String,
    default: ''
  },
  age: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  // Step 2: Religion & Therapy Preferences
  religion: {
    type: String,
    default: ''
  },
  religionImportance: {
    type: String,
    default: ''
  },
  spiritual: {
    type: String,
    default: ''
  },
  therapyHistory: {
    type: String,
    default: ''
  },
  therapyReasons: {
    type: [String],
    default: []
  },
  therapistExpectations: {
    type: [String],
    default: []
  },
  therapistStyle: {
    type: String,
    default: ''
  },
  therapistApproach: {
    type: String,
    default: ''
  },
  therapistManner: {
    type: String,
    default: ''
  },
  // Step 3: Current State
  depression: {
    type: String,
    default: ''
  },
  eatingHabits: {
    type: String,
    default: ''
  },
  physicalHealth: {
    type: String,
    default: ''
  },
  // Step 4: Past 2 Weeks Assessment
  littleInterest: {
    type: String,
    default: ''
  },
  motorActivity: {
    type: String,
    default: ''
  },
  feelingDown: {
    type: String,
    default: ''
  },
  troubleSleeping: {
    type: String,
    default: ''
  },
  feelingTired: {
    type: String,
    default: ''
  },
  poorAppetite: {
    type: String,
    default: ''
  },
  feelingBad: {
    type: String,
    default: ''
  },
  troubleConcentrating: {
    type: String,
    default: ''
  },
  thoughtsHurting: {
    type: String,
    default: ''
  },
  difficultyForWork: {
    type: String,
    default: ''
  },
  // Step 5: Additional Health Info
  employmentStatus: {
    type: String,
    default: ''
  },
  drinkingHabits: {
    type: String,
    default: ''
  },
  suicidalThoughts: {
    type: String,
    default: ''
  },
  panicAttacks: {
    type: String,
    default: ''
  },
  medication: {
    type: String,
    default: ''
  },
  // Step 6: Preferences & Resources
  financialStatus: {
    type: String,
    default: ''
  },
  usefulResources: {
    type: [String],
    default: []
  },
  communicateTherapist: {
    type: String,
    default: ''
  },
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
