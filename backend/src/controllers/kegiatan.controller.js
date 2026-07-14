import db from "../config/db.js";
import { sendEmail } from "../utils/sendEmail.js";
import { kirimNotifikasiKegiatan } from "../utils/notification.js";

export const createKegiatan = (req, res) => {
  const { paket_id, tanggal, kegiatan } = req.body;

  const checkQuery = `
    SELECT id
    FROM daftar_kegiatan
    WHERE paket_id = ? AND tanggal = ?
  `;

  db.query(checkQuery, [paket_id, tanggal], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({
        message: checkErr.message,
      });
    }

    const insertDetail = (daftarKegiatanId) => {
      if (!kegiatan || kegiatan.length === 0) {
        return res.status(200).json({
          message: "Berhasil",
        });
      }

      const values = kegiatan.map((item) => [
        daftarKegiatanId,
        item.nama,
        item.lokasi,
        item.dokumentasi || null,
      ]);

      const detailQuery = `
        INSERT INTO detail_kegiatan
        (daftar_kegiatan_id, nama, lokasi, dokumentasi)
        VALUES ?
      `;

      db.query(detailQuery, [values], async (detailErr) => {
        if (detailErr) {
          return res.status(500).json({
            message: detailErr.message,
          });
        }
        try {
          await kirimNotifikasiKegiatan(paket_id, tanggal, kegiatan);
        } catch (error) {
          console.error("Gagal mengirim notifikasi:", error);
        }

        return res.status(200).json({
          message: "Kegiatan berhasil disimpan",
        });
      });
    };

    if (checkResult.length > 0) {
      insertDetail(checkResult[0].id);
    } else {
      const insertQuery = `
        INSERT INTO daftar_kegiatan
        (paket_id, tanggal)
        VALUES (?, ?)
      `;

      db.query(insertQuery, [paket_id, tanggal], (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({
            message: insertErr.message,
          });
        }

        insertDetail(result.insertId);
      });
    }
  });
};

export const getKegiatan = (req, res) => {
  const { paket_id } = req.query;

  let query = `
    SELECT
      dk.id,
      dk.paket_id,
      dk.tanggal,
      d.id AS detail_id,
      d.nama,
      d.lokasi,
      d.dokumentasi
    FROM daftar_kegiatan dk
    LEFT JOIN detail_kegiatan d
      ON dk.id = d.daftar_kegiatan_id
  `;

  const params = [];

  if (paket_id) {
    query += ` WHERE dk.paket_id = ?`;
    params.push(paket_id);
  }

  query += ` ORDER BY dk.tanggal ASC, d.id ASC`;

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    const grouped = {};

    results.forEach((row) => {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id: row.id,
          paket_id: row.paket_id,
          tanggal: row.tanggal,
          kegiatan: [],
        };
      }

      if (row.detail_id) {
        grouped[row.id].kegiatan.push({
          id: row.detail_id,
          nama: row.nama,
          lokasi: row.lokasi,
          dokumentasi: row.dokumentasi,
        });
      }
    });

    return res.status(200).json(Object.values(grouped));
  });
};

//GET DETAIL KEGIATAN
export const getDetailKegiatan = (req, res) => {
  const { id } = req.params;

  const kegiatanQuery = `
    SELECT *
    FROM daftar_kegiatan
    WHERE id = ?
  `;

  db.query(kegiatanQuery, [id], (err, kegiatanResult) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (kegiatanResult.length === 0) {
      return res.status(404).json({
        message: "Kegiatan tidak ditemukan",
      });
    }

    const detailQuery = `
      SELECT
        id,
        nama,
        lokasi,
        dokumentasi
      FROM detail_kegiatan
      WHERE daftar_kegiatan_id = ?
      ORDER BY id ASC
    `;

    db.query(detailQuery, [id], (detailErr, detailResult) => {
      if (detailErr) {
        return res.status(500).json({
          message: detailErr.message,
        });
      }

      return res.status(200).json({
        ...kegiatanResult[0],
        kegiatan: detailResult,
      });
    });
  });
};

// GET DETAIL KEGIATAN BERDASARKAN DETAIL_ID
export const getDetailKegiatanById = (req, res) => {
  console.log("=== GET DETAIL KEGIATAN BY ID ===");
  console.log("PARAM:", req.params);

  const { id } = req.params;

  const query = `
    SELECT
      d.id,
      d.daftar_kegiatan_id,
      dk.tanggal,
      d.nama,
      d.lokasi,
      d.dokumentasi
    FROM detail_kegiatan d
    INNER JOIN daftar_kegiatan dk
      ON d.daftar_kegiatan_id = dk.id
    WHERE d.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Detail kegiatan tidak ditemukan",
      });
    }

    return res.status(200).json(result[0]);
  });
};

// UPDATE KEGIATAN (EDIT)
export const updateKegiatan = (req, res) => {
  const { id } = req.params;
  const { tanggal, kegiatan } = req.body;

  const formattedTanggal = tanggal.split("T")[0];

  const updateDaftarQuery = `
    UPDATE daftar_kegiatan
    SET tanggal = ?
    WHERE id = ?
  `;

  db.query(updateDaftarQuery, [formattedTanggal, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    // Hapus semua detail lama
    const deleteDetailQuery = `
      DELETE FROM detail_kegiatan
      WHERE daftar_kegiatan_id = ?
    `;

    db.query(deleteDetailQuery, [id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({
          message: deleteErr.message,
        });
      }

      // Kalau tidak ada kegiatan baru
      if (!kegiatan || kegiatan.length === 0) {
        return res.status(200).json({
          message: "Kegiatan berhasil diperbarui",
        });
      }

      // Insert ulang detail kegiatan
      const values = kegiatan.map((item) => [
        id,
        item.nama,
        item.lokasi,
        item.dokumentasi || null,
      ]);

      const insertDetailQuery = `
        INSERT INTO detail_kegiatan
        (daftar_kegiatan_id, nama, lokasi, dokumentasi)
        VALUES ?
      `;

      db.query(insertDetailQuery, [values], (insertErr) => {
        if (insertErr) {
          return res.status(500).json({
            message: insertErr.message,
          });
        }

        return res.status(200).json({
          message: "Kegiatan berhasil diperbarui",
        });
      });
    });
  });
};

// UPDATE SATU DETAIL KEGIATAN
export const updateDetailKegiatan = (req, res) => {
  const { id } = req.params;
  const { tanggal, nama, lokasi } = req.body;

  const formattedTanggal = tanggal.split("T")[0];

  // Cari daftar_kegiatan_id terlebih dahulu
  const findQuery = `
    SELECT daftar_kegiatan_id
    FROM detail_kegiatan
    WHERE id = ?
  `;

  db.query(findQuery, [id], (findErr, findResult) => {
    if (findErr) {
      return res.status(500).json({
        message: findErr.message,
      });
    }

    if (findResult.length === 0) {
      return res.status(404).json({
        message: "Detail kegiatan tidak ditemukan",
      });
    }

    const daftarKegiatanId = findResult[0].daftar_kegiatan_id;

    // Update tanggal
    const updateTanggalQuery = `
      UPDATE daftar_kegiatan
      SET tanggal = ?
      WHERE id = ?
    `;

    const formattedTanggal = tanggal.split("T")[0];

    db.query(
      updateTanggalQuery,
      [formattedTanggal, daftarKegiatanId],
      (tanggalErr) => {
        if (tanggalErr) {
          return res.status(500).json({
            message: tanggalErr.message,
          });
        }

        // Update detail
        const updateDetailQuery = `
          UPDATE detail_kegiatan
          SET
            nama = ?,
            lokasi = ?
          WHERE id = ?
        `;

        db.query(updateDetailQuery, [nama, lokasi, id], (detailErr) => {
          if (detailErr) {
            return res.status(500).json({
              message: detailErr.message,
            });
          }

          return res.status(200).json({
            message: "Kegiatan berhasil diperbarui",
          });
        });
      },
    );
  });
};

//DELETE KEGIATAN
export const deleteKegiatan = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM daftar_kegiatan WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    return res.status(200).json({
      message: "Kegiatan berhasil dihapus",
    });
  });
};

//Delete Detail Kegiatan
export const deleteDetailKegiatan = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM detail_kegiatan WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    return res.status(200).json({
      message: "Detail kegiatan berhasil dihapus",
    });
  });
};

//Update Dokumentasi Kegiatan
export const uploadDokumentasi = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({
      message: "Dokumentasi wajib diupload",
    });
  }

  const query = `
    UPDATE detail_kegiatan
    SET dokumentasi = ?
    WHERE id = ?
  `;

  db.query(query, [req.file.filename, id], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    return res.status(200).json({
      message: "Dokumentasi berhasil diupload",
    });
  });
};

//Get Galeri Kegiatan
export const getGaleri = (req, res) => {
  const query = `
    SELECT
      p.id AS paket_id,
      p.nama_paket,
      dk.id AS daftar_kegiatan_id,
      dk.tanggal,
      d.id AS detail_id,
      d.nama,
      d.lokasi,
      d.dokumentasi
    FROM paket_umrah p
    INNER JOIN daftar_kegiatan dk
      ON p.id = dk.paket_id
    INNER JOIN detail_kegiatan d
      ON dk.id = d.daftar_kegiatan_id
    WHERE d.dokumentasi IS NOT NULL
    ORDER BY p.id, dk.tanggal ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    const grouped = {};

    results.forEach((row) => {
      if (!grouped[row.paket_id]) {
        grouped[row.paket_id] = {
          id: row.paket_id,
          nama_paket: row.nama_paket,
          dokumentasi: [],
        };
      }

      grouped[row.paket_id].dokumentasi.push({
        id: row.detail_id,
        tanggal: row.tanggal,
        nama: row.nama,
        lokasi: row.lokasi,
        dokumentasi: row.dokumentasi,
      });
    });

    return res.status(200).json(Object.values(grouped));
  });
};

export const getGaleriById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      pu.id,
      pu.nama_paket,
      dk.tanggal,
      d.id AS detail_id,
      d.nama,
      d.lokasi,
      d.dokumentasi
    FROM paket_umrah pu
    JOIN daftar_kegiatan dk
      ON pu.id = dk.paket_id
    JOIN detail_kegiatan d
      ON dk.id = d.daftar_kegiatan_id
    WHERE pu.id = ?
      AND d.dokumentasi IS NOT NULL
    ORDER BY dk.tanggal ASC
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Galeri tidak ditemukan",
      });
    }

    return res.status(200).json({
      id: result[0].id,
      nama_paket: result[0].nama_paket,
      dokumentasi: result.map((item) => ({
        id: item.detail_id,
        nama: item.nama,
        lokasi: item.lokasi,
        tanggal: item.tanggal,
        dokumentasi: item.dokumentasi,
      })),
    });
  });
};

export const testEmail = async (req, res) => {
  try {
    await sendEmail({
      to: "tugasakhir064@gmail.com",
      subject: "Tes Notifikasi Sistem Manajemen Travel Umrah",
      html: `
    <h2>Halo 👋</h2>
    <p>Jika email ini masuk, berarti konfigurasi Nodemailer berhasil.</p>
  `,
    });

    res.json({
      success: true,
      message: "Email berhasil dikirim",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
