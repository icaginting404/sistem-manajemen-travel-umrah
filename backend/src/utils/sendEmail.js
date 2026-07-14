import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Paksa IPv4
dns.setDefaultResultOrder("ipv4first");

// Cek DNS yang dipakai
dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
  console.log("SMTP DNS:", addresses);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  family: 4,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("=================================");
    console.log("Mulai kirim email...");
    console.log("Tujuan :", to);

    const info = await transporter.sendMail({
      from: `"PT Syifa Amanah Baitullah" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ BERHASIL");
    console.log(info);
  } catch (err) {
    console.error("❌ GAGAL");
    console.error(err);
    throw err;
  }
};
