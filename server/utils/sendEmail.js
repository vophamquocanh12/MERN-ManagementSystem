// backend/utils/sendEmail.js
import nodemailer from "nodemailer";
import { generateEmailTemplate } from "./emailTemplate.js";

/**
 * Sends an email using Gmail SMTP via Nodemailer
 */
const sendEmail = async ({ to, subject, title, message, buttonText, buttonLink, rawHtml }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = rawHtml || generateEmailTemplate({ title, message, buttonText, buttonLink });

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail; // ✅ Default export
