import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"PT Syifa Amanah Baitullah" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,

      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logoTravel",
        },
      ],
    });

    console.log("✅ Email berhasil dikirim:", info.messageId);
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
    throw error;
  }
};
