import { stripe } from "../configs/stripe.js";
import Booking from "../models/Booking.js";

export const webhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature verification failed.", err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event?.data?.object;

    if (session.payment_status === "paid") {
      const bookingId = session.metadata.bookingId;

      const booking = await Booking.findById(bookingId);

      if (booking && booking.status !== "confirmed") {
        booking.status = "confirmed";
        await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });
        console.log("Booking updated successfully");
      }
    }
  }
  if (event.type === "payment_intent.payment_failed") {
    console.log("Payment failed, updating booking status...");
    const intent = event.data.object;

    const bookingId = intent.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: "failed" });
      console.log("Booking status updated to failed");
    }
  }

  res.status(200).json({ received: true });
};
