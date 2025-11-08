import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/payment_model.js";
import Reservation from "../models/reservation_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import reservation_model from "../models/reservation_model.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const reservation = await reservation_model.findOne({
    guestId: userId,
    status: "pending",
  });

  if (!reservation) {
    return res.status(404).json({ message: "No pending reservation found" });
  }

  const amount = reservation.totalPrice;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    metadata: {
      reservationId: reservation._id.toString(),
      userId: userId.toString(),
    },
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });

  const payment = await Payment.create({
    userId,
    reservationId: reservation._id,
    amount,
    currency: "usd",
    status: "pending",
    stripePaymentIntentId: paymentIntent.id,
  });

  res.status(201).json({
    message: "PaymentIntent created successfully",
    clientSecret: paymentIntent.client_secret,
    payment,
  });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;

  if (!paymentIntentId || !paymentMethodId) {
    return res.status(400).json({
      message: "paymentIntentId and paymentMethodId are required",
    });
  }

  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  });

  await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    { status: paymentIntent.status },
    { new: true }
  );

  res.json({ message: "Payment confirmed successfully", payment: paymentIntent });
});

export const handleWebhook = asyncHandler(async (req, res) => {
  const event = req.body;

  switch (event.type) {
    case "payment_intent.succeeded":
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: event.data.object.id },
        { status: "succeeded" }
      );
      break;

    case "payment_intent.payment_failed":
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: event.data.object.id },
        { status: "failed" }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
