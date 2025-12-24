import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import { sendConfirmationEmail } from '../utils/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

async function handleCheckoutSessionCompleted(session) {
  console.log('✅ Checkout session completed:', session.id);

  const bookingId = session.metadata.bookingId;

  if (!bookingId) {
    console.error('No bookingId found in session metadata');
    return;
  }

  try {
    const booking = await Booking.findById(bookingId).populate('psychologistId');

    if (!booking) {
      console.error('Booking not found:', bookingId);
      return;
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.stripePaymentIntentId = session.payment_intent;
    booking.paidAt = new Date();

    await booking.save();

    console.log(`✅ Booking ${bookingId} confirmed and marked as paid`);

    try {
      await sendConfirmationEmail(booking);
      console.log(`✅ Confirmation email sent for booking ${bookingId}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);

  const bookingId = paymentIntent.metadata.bookingId;

  if (!bookingId) {
    console.log('No bookingId in payment intent metadata');
    return;
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error('Booking not found:', bookingId);
      return;
    }

    if (!booking.stripePaymentIntentId) {
      booking.stripePaymentIntentId = paymentIntent.id;
      await booking.save();
    }

  } catch (error) {
    console.error('Error processing payment intent:', error);
    throw error;
  }
}


async function handlePaymentIntentFailed(paymentIntent) {
  console.log('❌ Payment intent failed:', paymentIntent.id);

  const bookingId = paymentIntent.metadata.bookingId;

  if (!bookingId) {
    return;
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.error('Booking not found:', bookingId);
      return;
    }

    console.log(`Payment failed for booking ${bookingId}`);


  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}


async function handleChargeRefunded(charge) {
  console.log('💰 Charge refunded:', charge.id);

  const paymentIntentId = charge.payment_intent;

  if (!paymentIntentId) {
    return;
  }

  try {
    const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntentId });

    if (!booking) {
      console.log('No booking found for refunded charge');
      return;
    }

    booking.paymentStatus = 'refunded';
    await booking.save();

    console.log(`✅ Booking ${booking._id} marked as refunded`);

  } catch (error) {
    console.error('Error handling refund:', error);
    throw error;
  }
}
