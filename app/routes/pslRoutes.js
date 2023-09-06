import express from "express";
import { PSLUpdates } from "../handlers/pslHandler.js";
import twilio from "twilio";

const router = express.Router();

router.post(
  "/",
  twilio.webhook({ authToken: process.env.TWILIO_TOKEN }),
  PSLUpdates
);

export default router;
