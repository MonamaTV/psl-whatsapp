import twilio from "twilio";
import { config } from "dotenv";

config();
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendWhatsappMessage = async (from, to, message) => {
  const response = await twilioClient.messages.create({
    body: message,
    from: from,
    to: to,
  });

  return response;
};
