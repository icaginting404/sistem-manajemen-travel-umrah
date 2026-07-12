import db from "../config/db.js";

export const getDashboardOwner = async (req, res) => {
  try {
    const query = (sql) =>
      new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

    const [
      jamaah,
      paket,
      pesanan,
      pendapatan,
      pengeluaran,
    ] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM users WHERE role='jamaah'"),
      query("SELECT COUNT(*) AS total FROM paket_umrah WHERE status_paket='aktif'"),
      query("SELECT COUNT(*) AS total FROM pesanan"),
      query("SELECT IFNULL(SUM(jumlah),0) AS total FROM pembayaran"),
      query("SELECT IFNULL(SUM(nominal),0) AS total FROM biaya_operasional"),
    ]);

    const totalPendapatan = Number(pendapatan[0].total);
    const totalPengeluaran = Number(pengeluaran[0].total);

    return res.json({
      cards: {
        totalJamaah: jamaah[0].total,
        totalPaket: paket[0].total,
        totalPesanan: pesanan[0].total,
        pendapatan: totalPendapatan,
        pengeluaran: totalPengeluaran,
        laba: totalPendapatan - totalPengeluaran,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Gagal mengambil dashboard owner",
    });
  }
};

export const getChartOwner = async (req, res) => {
  try {
    const query = (sql) =>
      new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

    // Grafik Jamaah
    const jamaah = await query(`
      SELECT
        MONTH(created_at) AS bulan,
        COUNT(*) AS total
      FROM users
      WHERE role='jamaah'
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `);

    // Grafik Pendapatan
    const pendapatan = await query(`
      SELECT
        MONTH(tanggal_bayar) AS bulan,
        SUM(jumlah) AS total
      FROM pembayaran
      GROUP BY MONTH(tanggal_bayar)
      ORDER BY MONTH(tanggal_bayar)
    `);

    // Grafik Pengeluaran
    const pengeluaran = await query(`
      SELECT
        MONTH(tanggal) AS bulan,
        SUM(nominal) AS total
      FROM biaya_operasional
      GROUP BY MONTH(tanggal)
      ORDER BY MONTH(tanggal)
    `);

    const bulan = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    res.json({
      jamaah: jamaah.map((j) => ({
        bulan: bulan[j.bulan],
        total: Number(j.total),
      })),

      pendapatan: pendapatan.map((p) => ({
        bulan: bulan[p.bulan],
        total: Number(p.total),
      })),

      pengeluaran: pengeluaran.map((p) => ({
        bulan: bulan[p.bulan],
        total: Number(p.total),
      })),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Gagal mengambil grafik",
    });
  }
};