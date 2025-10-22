import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export default async function sendEmail(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Tripper" <hefnyhazem531@gmail.com>',
    to,
    subject,
    html: htmlContent,
  });

  console.log("Message sent:", info.messageId);
}
