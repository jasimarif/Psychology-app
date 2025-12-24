import stripe from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Psychologist from '../models/Psychologist.js';


export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId).populate('psychologistId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized access to this booking' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'This booking has already been paid' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot pay for a cancelled booking' });
    }

    const psychologist = booking.psychologistId;

    let customerId = booking.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: booking.userName || req.user.displayName,
        metadata: {
          userId: req.user.uid,
          firebaseUid: req.user.uid
        }
      });
      customerId = customer.id;

      booking.stripeCustomerId = customerId;
      await booking.save();
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: booking.currency.toLowerCase(),
            product_data: {
              name: `Therapy Session with ${psychologist.name}`,
              description: `${psychologist.title} - ${new Date(booking.appointmentDate).toLocaleDateString()} at ${booking.startTime}`,
              images: psychologist.profileImage ? [psychologist.profileImage] : [],
            },
            unit_amount: Math.round(booking.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancelled?booking_id=${bookingId}`,
      metadata: {
        bookingId: bookingId.toString(),
        psychologistId: psychologist._id.toString(),
        userId: req.user.uid,
        appointmentDate: booking.appointmentDate.toISOString(),
        startTime: booking.startTime,
        endTime: booking.endTime
      },
      payment_intent_data: {
        metadata: {
          bookingId: bookingId.toString(),
          psychologistId: psychologist._id.toString(),
          userId: req.user.uid
        }
      }
    });

    booking.stripeSessionId = session.id;
    await booking.save();

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
