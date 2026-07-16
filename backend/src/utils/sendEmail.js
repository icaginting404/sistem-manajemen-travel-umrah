import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("=== SMTP CONFIG ===");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("SECURE:", process.env.EMAIL_SECURE);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS EXISTS:", process.env.EMAIL_PASS ? "YES" : "NO");
console.log("===================");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("=================================");
    console.log("Mulai kirim email...");
    console.log("Tujuan:", to);

    const info = await transporter.sendMail({
      from: `"PT Syifa Amanah Baitullah" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ EMAIL BERHASIL DIKIRIM");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (err) {
    console.error("❌ EMAIL GAGAL DIKIRIM");
    console.error(err);

    throw err;
  }
};
