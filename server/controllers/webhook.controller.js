import { handleStripeWebhookService } from "../services/webhook.service.js";

export const webhookController = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];

    await handleStripeWebhookService(
      req.body, // ⚠ must be raw body
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    res.status(200).json({ received: true });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
