import stripe from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Psychologist from '../models/Psychologist.js';


export const createCheckoutSession = async (req, res) => {
  try {
    const { psychologistId, appointmentDate, startTime, endTime, notes, userId, userEmail, userName } = req.body;

    if (!psychologistId || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const psychologist = await Psychologist.findById(psychologistId);

    if (!psychologist) {
      return res.status(404).json({ error: 'Psychologist not found' });
    }

    // Get or create Stripe customer
    const customer = await stripe.customers.create({
      email: userEmail || req.user.email,
      name: userName || req.user.displayName,
      metadata: {
        userId: userId || req.user.uid,
        firebaseUid: userId || req.user.uid
      }
    });

    const customerId = customer.id;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: (psychologist.currency || 'USD').toLowerCase(),
            product_data: {
              name: `Therapy Session with ${psychologist.name}`,
              description: `${psychologist.title} - ${new Date(appointmentDate).toLocaleDateString()} at ${startTime}`,
              images: psychologist.profileImage ? [psychologist.profileImage] : [],
            },
            unit_amount: Math.round(psychologist.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancelled`,
      metadata: {
        psychologistId: psychologistId.toString(),
        userId: userId || req.user.uid,
        userEmail: userEmail || req.user.email,
        userName: userName || req.user.displayName || req.user.email,
        appointmentDate: new Date(appointmentDate).toISOString(),
        startTime,
        endTime,
        notes: notes || '',
        timezone: psychologist.availability.timezone || 'America/New_York',
        price: psychologist.price.toString(),
        currency: psychologist.currency || 'USD',
        stripeCustomerId: customerId
      },
      payment_intent_data: {
        metadata: {
          psychologistId: psychologistId.toString(),
          userId: userId || req.user.uid
        }
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
};


export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const booking = await Booking.findOne({ stripeSessionId: sessionId });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found for this session' });
    }

    if (booking.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access to this session' });
    }

    res.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency
      },
      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paidAt: booking.paidAt
      }
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({
      error: 'Failed to retrieve checkout session',
      message: error.message
    });
  }
};


export const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Booking has not been paid' });
    }

    if (booking.paymentStatus === 'refunded') {
      return res.status(400).json({ error: 'Booking has already been refunded' });
    }

    if (!booking.stripePaymentIntentId) {
      return res.status(400).json({ error: 'No payment intent found for this booking' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: booking.stripePaymentIntentId,
      metadata: {
        bookingId: bookingId.toString(),
        reason: booking.cancellationReason || 'Customer requested cancellation'
      }
    });

    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status
      },
      booking: {
        id: booking._id,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      error: 'Failed to process refund',
      message: error.message
    });
  }
};
