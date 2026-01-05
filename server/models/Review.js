import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    default: ''
  },
  psychologistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Psychologist',
    required: true,
    index: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true // One review per booking
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
reviewSchema.index({ psychologistId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Static method to calculate average rating for a psychologist
reviewSchema.statics.calculateAverageRating = async function(psychologistId) {
  const result = await this.aggregate([
    { $match: { psychologistId: new mongoose.Types.ObjectId(psychologistId), isVisible: true } },
    {
      $group: {
        _id: '$psychologistId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10, 
      totalReviews: result[0].totalReviews
    };
  }

  return { averageRating: 0, totalReviews: 0 };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
