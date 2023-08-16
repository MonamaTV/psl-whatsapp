import express from "express";
import {
  fetchFixtures,
  fetchResults,
  fetchTable,
} from "../handlers/pslHandler.js";
import twilio from "twilio";

const router = express.Router();

router.get("/log", fetchTable);
router.get("/results", fetchResults);
// router.get("/fixtures", fetchFixtures);
router.post(
  "/fixtures",
  twilio.webhook({ authToken: process.env.TWILIO_TOKEN }),
  fetchFixtures
);

export default router;
