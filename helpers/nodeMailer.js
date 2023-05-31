const nodemailer = require('nodemailer');
const { emailNodeMailer, emailPassword, emailHost } = require('../config/enviroment')

const sendEmail = async (to, body, subject, html) => {

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: 587,
    auth: {
      user: emailNodeMailer,
      pass: emailPassword
    }
  });

  try {
    const info = await transporter.sendMail({
      from: emailNodeMailer,
      to,
      subject,
      text: body,
      html
    })
    return {
      result: "success",
      messageId: info.messageId,
    };
  } catch (e) {
    return {
      result: "error",
      message: e.message,
    };
  }
}



module.exports = sendEmail