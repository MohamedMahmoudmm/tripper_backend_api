import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/payment_model.js";
import Reservation from "../models/reservation_model.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ message: "Reservation ID is required" });
  }

  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  if (reservation.guestId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized access to this reservation" });
  }

  if (reservation.paymentStatus === "succeeded") {
    return res.status(400).json({ message: "This reservation is already paid" });
  }

  // ✅ Check if payment already exists for this reservation
  const existingPayment = await Payment.findOne({ reservationId });
  
  if (existingPayment) {
    // ✅ If payment exists, return existing payment intent
    const existingIntent = await stripe.paymentIntents.retrieve(existingPayment.stripePaymentIntentId);
    
    return res.status(200).json({
      message: "Payment already created",
      clientSecret: existingIntent.client_secret,
      payment: existingPayment,
    });
  }

  const amount = reservation.totalPrice;

  // ✅ Create new payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    metadata: {
      reservationId: reservation._id.toString(),
      userId: userId.toString(),
    },
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });

  // ✅ Create payment record ONCE
  const payment = await Payment.create({
    userId,
    reservationId: reservation._id,
    amount,
    currency: "usd",
    status: "pending",
    stripePaymentIntentId: paymentIntent.id,
  });

  // ✅ Update reservation payment status to pending
  reservation.paymentStatus = "pending";
  await reservation.save();

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
    case "payment_intent.succeeded": {
      const paymentIntentId = event.data.object.id;
      
      // ✅ Update Payment status
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        { status: "succeeded" },
        { new: true }
      );

      if (payment) {
        // ✅ Update Reservation payment status
        await Reservation.findByIdAndUpdate(
          payment.reservationId,
          { 
            paymentStatus: "succeeded",
            status: "confirmed" 
          }
        );
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntentId = event.data.object.id;
      
      // ✅ Update Payment status
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        { status: "failed" },
        { new: true }
      );

      if (payment) {
        // ✅ Update Reservation payment status
        await Reservation.findByIdAndUpdate(
          payment.reservationId,
          { paymentStatus: "failed" }
        );
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});