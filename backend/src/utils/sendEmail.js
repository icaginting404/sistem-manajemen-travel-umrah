import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Paksa Node menggunakan IPv4
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  console.log("Mengirim email ke:", to);

  const info = await transporter.sendMail({
    from: `"PT Syifa Amanah Baitullah" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email berhasil:", info.messageId);
};
