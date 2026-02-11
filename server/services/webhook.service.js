import { stripe } from "../configs/stripe.js";
import Booking from "../models/Booking.js";

export const handleStripeWebhookService = async (
  rawBody,
  signature,
  webhookSecret
) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // ✅ Checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) return;

      const booking = await Booking.findById(bookingId);

      if (booking && booking.status !== "confirmed") {
        booking.status = "confirmed";
        await booking.save();
      }
    }
  }

  // ❌ Payment failed
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;

    const bookingId = intent.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: "failed",
      });
    }
  }

  return true;
};
