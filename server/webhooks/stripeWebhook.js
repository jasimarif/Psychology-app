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

  const metadata = session.metadata;

  if (!metadata.psychologistId || !metadata.appointmentDate || !metadata.startTime || !metadata.endTime) {
    console.error('Missing booking data in session metadata');
    return;
  }

  try {
    const booking = await Booking.create({
      userId: metadata.userId,
      userEmail: metadata.userEmail,
      userName: metadata.userName,
      psychologistId: metadata.psychologistId,
      appointmentDate: new Date(metadata.appointmentDate),
      startTime: metadata.startTime,
      endTime: metadata.endTime,
      timezone: metadata.timezone,
      price: parseFloat(metadata.price),
      currency: metadata.currency,
      notes: metadata.notes || '',
      status: 'confirmed', 
      paymentStatus: 'paid',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      stripeCustomerId: metadata.stripeCustomerId,
      paidAt: new Date()
    });

    await booking.populate('psychologistId');

    console.log(`✅ Booking created and confirmed: ${booking._id}`);

    try {
      await sendConfirmationEmail(booking);
      console.log(`✅ Confirmation email sent for booking ${booking._id}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }

  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}


async function handlePaymentIntentFailed(paymentIntent) {
  console.log('❌ Payment intent failed:', paymentIntent.id);

  // No booking to update since booking is only created after successful payment
  const userId = paymentIntent.metadata.userId;
  const psychologistId = paymentIntent.metadata.psychologistId;

  console.log(`Payment failed for user ${userId} trying to book psychologist ${psychologistId}`);
}

/**
 * Handle refunded charges
 */
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
