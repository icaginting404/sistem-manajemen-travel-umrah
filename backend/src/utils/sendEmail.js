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

console.log("=== SMTP CONFIG ===");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("SECURE:", process.env.EMAIL_SECURE);
console.log("USER:", process.env.EMAIL_USER);
console.log("===================");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

await transporter
  .verify()
  .then(() => console.log("SMTP CONNECTED"))
  .catch((err) => console.error("SMTP ERROR:", err));

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
