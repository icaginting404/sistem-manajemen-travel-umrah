import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("SMTP Error:", err);
  } else {
    console.log("SMTP Ready");
  }
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
