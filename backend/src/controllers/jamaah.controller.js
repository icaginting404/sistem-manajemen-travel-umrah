import db from "../config/db.js";

// GET ALL JAMAAH
export const getAllJamaah = (req, res) => {
  const sql = `
    SELECT
      u.id,
      u.nama,
      u.email,
      u.nomor_hp,
      pj.jenis_kelamin,
      pj.tanggal_lahir,
      pj.kota_kabupaten

    FROM users u

    LEFT JOIN profil_jamaah pj
      ON u.id = pj.user_id

    WHERE u.role = 'jamaah'

    ORDER BY u.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data jamaah",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// GET JAMAAH BERDASARKAN PAKET UMRAH
export const getJamaahByPaket = (req, res) => {
  const { paketId } = req.params;

  const sql = `
    SELECT
      u.id,
      u.nama,
      pj.jenis_kelamin,
      u.nomor_hp

    FROM pesanan p

    INNER JOIN users u
      ON p.user_id = u.id

    LEFT JOIN profil_jamaah pj
      ON u.id = pj.user_id

    WHERE
      p.paket_umrah_id = ?
      AND u.role = 'jamaah'
      AND p.status_pesanan IN ('dalam_cicilan', 'lunas')

    ORDER BY u.nama ASC
  `;

  db.query(sql, [paketId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data jamaah",
        error: err.message,
      });
    }

    res.status(200).json(results);
  });
};

// GET DETAIL JAMAAH
export const getJamaahById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      u.id,
      u.nama,
      u.email,
      u.nomor_hp,

      pj.nama_tambahan,
      pj.tempat_lahir,
      pj.tanggal_lahir,
      pj.nomor_ktp,
      pj.nomor_paspor,
      pj.tanggal_dikeluarkan_paspor,
      pj.tempat_dikeluarkan_paspor,
      pj.masa_berlaku_paspor,
      pj.jenis_kelamin,
      pj.status_perkawinan,
      pj.alamat,
      pj.kota_kabupaten,
      pj.provinsi,
      pj.pekerjaan

    FROM users u

    LEFT JOIN profil_jamaah pj
      ON u.id = pj.user_id

    WHERE u.id = ?
      AND u.role = 'jamaah'
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil detail jamaah",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Jamaah tidak ditemukan",
      });
    }

    const jamaah = results[0];

    // Ambil kontak darurat
    const kontakSql = `
      SELECT
        nama_lengkap,
        alamat,
        hubungan,
        nomor_hp,
        urutan

      FROM kontak_darurat

      WHERE user_id = ?

      ORDER BY urutan ASC
    `;

    db.query(kontakSql, [id], (err, kontak) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengambil kontak darurat",
          error: err.message,
        });
      }

      // Ambil berkas
      const berkasSql = `
        SELECT
          id,
          jenis_berkas,
          nama_berkas,
          file_path

        FROM berkas_jamaah

        WHERE user_id = ?
      `;

      db.query(berkasSql, [id], (err, berkas) => {
        if (err) {
          return res.status(500).json({
            message: "Gagal mengambil berkas",
            error: err.message,
          });
        }

        res.status(200).json({
          ...jamaah,

          kontak_darurat: kontak,

          berkas: berkas.map((item) => ({
            ...item,
            file_path: item.file_path.replace(/\\/g, "/"),
          })),
        });
      });
    });
  });
};

export const deleteJamaah = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM users
    WHERE id = ?
    AND role = 'jamaah'
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus jamaah",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Jamaah tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data jamaah berhasil dihapus",
    });
  });
};

export const getJadwalKegiatanJamaah = (req, res) => {
  const { id } = req.params;

  const sql = `
SELECT
    dk.id,
    dk.tanggal,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', det.id,
            'nama', det.nama,
            'lokasi', det.lokasi,
            'dokumentasi', det.dokumentasi
        )
    ) AS kegiatan
FROM pesanan p
JOIN daftar_kegiatan dk
    ON dk.paket_id = p.paket_umrah_id
JOIN detail_kegiatan det
    ON det.daftar_kegiatan_id = dk.id
WHERE p.user_id = ?
AND p.status_pesanan IN ('lunas','dalam_cicilan')
GROUP BY dk.id
ORDER BY dk.tanggal;
`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

export const getStatusPaketJamaah = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id
    FROM pesanan
    WHERE user_id = ?
      AND status_pesanan IN ('lunas', 'dalam_cicilan')
    LIMIT 1
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      punyaPaket: result.length > 0,
    });
  });
};
