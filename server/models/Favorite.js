import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  psychologists: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  collection: 'favorites'
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
