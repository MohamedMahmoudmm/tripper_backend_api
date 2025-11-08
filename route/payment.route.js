import express from "express";
import bodyParser from "body-parser";
import { createPayment, confirmPayment, handleWebhook } from "../controller/payment.controller.js";
import { auth } from "../middlewares/is_Auth.js";

const paymentrouter = express.Router();

paymentrouter.post("/create", auth, createPayment);
paymentrouter.post("/confirm", auth, confirmPayment);
paymentrouter.post("/webhook", bodyParser.raw({ type: "application/json" }), handleWebhook);

export default paymentrouter;
