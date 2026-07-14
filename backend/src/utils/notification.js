import db from "../config/db.js";
import { sendEmail } from "./sendEmail.js";

const formatTanggal = (tanggal) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const kirimNotifikasiKegiatan = (paketId, tanggal, kegiatan) => {
  const query = `
    SELECT DISTINCT
      u.nama,
      u.email
    FROM users u
    INNER JOIN pesanan p
      ON u.id = p.user_id
    WHERE p.paket_umrah_id = ?
      AND p.status_pesanan IN ('lunas', 'dalam_cicilan')
      AND u.email IS NOT NULL
  `;

  db.query(query, [paketId], async (err, results) => {
    if (err) {
      console.error("Gagal mengambil data jamaah:", err);
      return;
    }

    if (results.length === 0) {
      console.log("Tidak ada jamaah yang menerima notifikasi.");
      return;
    }

    for (const jamaah of results) {
      const tanggalFormat = formatTanggal(tanggal);
      console.log("Mengirim email ke:", jamaah.email);

      try {
        await sendEmail({
          to: jamaah.email,
          subject:
            "Informasi Jadwal Kegiatan Umrah - PT Syifa Amanah Baitullah",
          html: `
<div style="background:#f4f4f4;padding:40px 20px;font-family:Arial,sans-serif;">

<div style="
max-width:700px;
margin:auto;
background:white;
border-radius:12px;
overflow:hidden;
box-shadow:0 5px 15px rgba(0,0,0,.15);
">

<div style="
padding:35px;
text-align:center;
">

<img
src="cid:logoTravel"
width="120"
style="margin-bottom:15px;" />

<h1 style="
margin:0;
color:#222;
font-size:28px;
">
PT Syifa Amanah Baitullah
</h1>

<p style="
margin-top:8px;
color:#666;
font-size:15px;
">
Penyelenggara Perjalanan Ibadah Umrah
</p>

<hr style="
margin-top:25px;
border:none;
height:4px;
background:#FCCF40;
">

</div>

<div style="padding:40px;">

<h2 style="color:#333;">
Assalamu'alaikum Warahmatullahi Wabarakatuh
</h2>

<p>
Yth.
<b>${jamaah.nama}</b>,
</p>

<p style="line-height:28px;">
Terima kasih telah mempercayakan perjalanan ibadah umrah kepada
<b>PT Syifa Amanah Baitullah.</b>
</p>

<p style="line-height:28px;">
Kami ingin menginformasikan bahwa terdapat
<b>jadwal kegiatan (itinerary)</b>
terbaru untuk paket umrah yang Anda ikuti.
</p>

<div style="
margin:30px 0;
padding:20px;
background:#FFF9DB;
border-left:6px solid #FCCF40;
border-radius:8px;
">

<b>📅 Tanggal Kegiatan</b>

<br><br>

${tanggal}

</div>

<h3 style="color:#333;">
Daftar Kegiatan
</h3>

${kegiatan
  .map(
    (item) => `
<div style="
border:1px solid #e5e5e5;
padding:18px;
border-radius:10px;
margin-bottom:15px;
">

<div style="
font-size:18px;
font-weight:bold;
color:#222;
">

${item.nama}

</div>

<div style="
margin-top:8px;
color:#666;
">

📍 ${item.lokasi}

</div>

</div>
`,
  )
  .join("")}

<p style="
margin-top:30px;
line-height:28px;
">

Silakan login ke
<b>Sistem Manajemen Travel Umrah</b>
untuk melihat informasi selengkapnya.

</p>

<p style="
margin-top:25px;
line-height:28px;
">

Semoga Allah SWT senantiasa memberikan kesehatan,
kemudahan, dan keberkahan dalam perjalanan ibadah Anda.

</p>

<br>

<p>
Wassalamu'alaikum Warahmatullahi Wabarakatuh.
</p>

<br>

<b>
PT Syifa Amanah Baitullah
</b>

</div>

<div style="
background:#fafafa;
padding:25px;
text-align:center;
font-size:13px;
color:#777;
border-top:1px solid #eee;
">

Email ini dikirim secara otomatis oleh

<b>
PT Syifa Amanah Baitullah
</b>

<br><br>

Mohon untuk tidak membalas email ini.

</div>

</div>

</div>
`,
        });

        console.log("📧 Email terkirim ke", jamaah.email);
      } catch (error) {
        console.error("Gagal kirim email:", error);
      }
    }
  });
};
