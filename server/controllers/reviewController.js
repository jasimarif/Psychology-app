import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Psychologist from '../models/Psychologist.js';
import mongoose from 'mongoose';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, reviewText, isAnonymous } = req.body;
    const { uid, displayName, email } = req.user;

    // Validate required fields
    if (!bookingId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID, rating, and review text are required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if booking exists and belongs to the user
    const booking = await Booking.findById(bookingId).populate('psychologistId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed sessions'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this session'
      });
    }

    // Create the review
    const review = new Review({
      userId: uid,
      userName: displayName || 'Anonymous User',
      userEmail: email || '',
      psychologistId: booking.psychologistId._id,
      bookingId,
      rating,
      reviewText,
      isAnonymous: isAnonymous || false
    });

    await review.save();

    // Update psychologist's average rating
    const { averageRating, totalReviews } = await Review.calculateAverageRating(booking.psychologistId._id);
    
    await Psychologist.findByIdAndUpdate(booking.psychologistId._id, {
      rating: averageRating,
      reviews: totalReviews
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all reviews for a psychologist
export const getReviewsByPsychologist = async (req, res) => {
  try {
    const { psychologistId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate psychologist exists
    const psychologist = await Psychologist.findById(psychologistId);
    if (!psychologist) {
      return res.status(404).json({
        success: false,
        message: 'Psychologist not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ 
      psychologistId, 
      isVisible: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('bookingId', 'appointmentDate');

    const totalReviews = await Review.countDocuments({ 
      psychologistId, 
      isVisible: true 
    });

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { psychologistId: new mongoose.Types.ObjectId(psychologistId), isVisible: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Convert to object for easier frontend usage
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / parseInt(limit)),
          totalReviews,
          hasMore: skip + reviews.length < totalReviews
        },
        ratingDistribution: distribution,
        averageRating: psychologist.rating,
        totalReviewCount: psychologist.reviews
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const { uid } = req.user;

    const reviews = await Review.find({ userId: uid })
      .sort({ createdAt: -1 })
      .populate('psychologistId', 'name title profileImage')
      .populate('bookingId', 'appointmentDate');

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check if a review exists for a booking
export const checkReviewExists = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { uid } = req.user;

    const review = await Review.findOne({ bookingId, userId: uid });

    res.json({
      success: true,
      data: {
        exists: !!review,
        review: review || null
      }
    });
  } catch (error) {
    console.error('Error checking review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check review status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a review (only by the owner)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText, isAnonymous } = req.body;
    const { uid } = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (reviewText) review.reviewText = reviewText;
    if (isAnonymous !== undefined) review.isAnonymous = isAnonymous;

    await review.save();

    // Update psychologist's average rating
    const { averageRating, totalReviews } = await Review.calculateAverageRating(review.psychologistId);
    
    await Psychologist.findByIdAndUpdate(review.psychologistId, {
      rating: averageRating,
      reviews: totalReviews
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a review (only by the owner)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { uid } = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    const psychologistId = review.psychologistId;
    await review.deleteOne();

    // Update psychologist's average rating
    const { averageRating, totalReviews } = await Review.calculateAverageRating(psychologistId);
    
    await Psychologist.findByIdAndUpdate(psychologistId, {
      rating: averageRating,
      reviews: totalReviews
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
