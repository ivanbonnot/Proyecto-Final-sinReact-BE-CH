const twilio = require("twilio");
const { twilioAccountSid, twilioAuthToken, twilioWspNumberr, twilioNumber } = require('../config/enviroment')

const sendMessage = async (to, body, sendToWhatsapp) => {
  try {
    const from = sendToWhatsapp ? twilioWspNumberr : twilioNumber;
    const sendTo = sendToWhatsapp ? `whatsapp:${to}` : `+${to}`;

    const client = twilio(twilioAccountSid, twilioAuthToken);
    const message = await client.messages.create({
      body,
      from,
      to: sendTo,
    });

    return {
      result: "success",
      messageId: message.sid,
    };
  } catch (e) {
    return {
      result: "error",
      message: e.message,
    };
  }
};

module.exports = sendMessage