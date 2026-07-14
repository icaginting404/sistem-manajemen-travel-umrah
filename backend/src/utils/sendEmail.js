import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "PT Syifa Amanah Baitullah <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Gagal mengirim email:", error);
      throw error;
    }

    console.log("✅ Email berhasil dikirim:", data?.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
