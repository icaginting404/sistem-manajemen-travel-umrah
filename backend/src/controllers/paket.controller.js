import db from "../config/db.js";
import path from "path";
import fs from "fs";

export const getAllPaket = (req, res) => {
  const sql = `
    SELECT
      pu.*,
      (
        SELECT COUNT(*)
        FROM pesanan p
        WHERE p.paket_umrah_id = pu.id
        AND p.status_pesanan IN (
          'menunggu_pembayaran',
          'dalam_cicilan',
          'lunas'
        )
      ) AS jumlah_peserta

    FROM paket_umrah pu
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data", error: err });
    const data = results.map(item => ({
      ...item,
      kuota_tersedia:
      item.total_kuota - item.jumlah_peserta
    }));

    res.status(200).json(data);
  });
};

//GET BY ID
export const getPaketById = (req, res) => {
  const { id } = req.params;
  const sql = `
  SELECT
    pu.*,
    (
      SELECT COUNT(*)
      FROM pesanan p
      WHERE p.paket_umrah_id = pu.id
      AND p.status_pesanan IN (
        'menunggu_pembayaran',
        'dalam_cicilan',
        'lunas'
      )
    ) AS jumlah_peserta

    FROM paket_umrah pu
    WHERE pu.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Paket tidak ditemukan" });
    const data = results[0];

    data.kuota_tersedia =
      data.total_kuota - data.jumlah_peserta;

    res.status(200).json(data);
  });
};

//CREATE
export const createPaket = (req, res) => {
  const {
    nama_paket,
    jadwal_keberangkatan,
    harga,
    durasi_perjalanan,
    hotel,
    total_kuota,
    maskapai,
    status_paket,
    fasilitas,
    tidak_termasuk_harga,
  } = req.body;

  const flyer = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO paket_umrah 
      (nama_paket, jadwal_keberangkatan, harga, durasi_perjalanan, hotel, total_kuota, maskapai, status_paket, fasilitas, tidak_termasuk_harga, flyer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const formattedDate = jadwal_keberangkatan
  ? new Date(jadwal_keberangkatan)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
  : null;

  const values = [
    nama_paket,
    formattedDate,
    harga,
    durasi_perjalanan,
    hotel,
    total_kuota,
    maskapai,
    status_paket,
    fasilitas,
    tidak_termasuk_harga,
    flyer,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("MYSQL ERROR:", err);

      return res.status(500).json({
        message: "Gagal menambahkan paket",
        error: err.message,
      });
    }
    res.status(201).json({ message: "Paket berhasil ditambahkan", id: result.insertId });
  });
};

//UPDATE
export const updatePaket = (req, res) => {
  const { id } = req.params;

  const {
    nama_paket,
    jadwal_keberangkatan,
    harga,
    durasi_perjalanan,
    hotel,
    total_kuota,
    maskapai,
    status_paket,
    fasilitas,
    tidak_termasuk_harga,
  } = req.body;

  const flyer = req.file ? req.file.filename : null;

  // Format tanggal supaya cocok dengan MySQL DATETIME
  const formattedDate = jadwal_keberangkatan
    ? new Date(jadwal_keberangkatan)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")
    : null;

  const sql = flyer
    ? `
      UPDATE paket_umrah
      SET
        nama_paket=?,
        jadwal_keberangkatan=?,
        harga=?,
        durasi_perjalanan=?,
        hotel=?,
        total_kuota=?,
        maskapai=?,
        status_paket=?,
        fasilitas=?,
        tidak_termasuk_harga=?,
        flyer=?
      WHERE id=?
    `
    : `
      UPDATE paket_umrah
      SET
        nama_paket=?,
        jadwal_keberangkatan=?,
        harga=?,
        durasi_perjalanan=?,
        hotel=?,
        total_kuota=?,
        maskapai=?,
        status_paket=?,
        fasilitas=?,
        tidak_termasuk_harga=?
      WHERE id=?
    `;

  const values = flyer
    ? [
        nama_paket,
        formattedDate,
        harga,
        durasi_perjalanan,
        hotel,
        total_kuota,
        maskapai,
        status_paket,
        fasilitas,
        tidak_termasuk_harga,
        flyer,
        id,
      ]
    : [
        nama_paket,
        formattedDate,
        harga,
        durasi_perjalanan,
        hotel,
        total_kuota,
        maskapai,
        status_paket,
        fasilitas,
        tidak_termasuk_harga,
        id,
      ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("MYSQL UPDATE ERROR:", err);

      return res.status(500).json({
        message: "Gagal mengupdate paket",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Paket tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Paket berhasil diupdate",
    });
  });
};

//DELETE
export const deletePaket = (req, res) => {
  const { id } = req.params;

  // Hapus file flyer apabila ada sebelum menghapus data paket
  const selectSql = "SELECT flyer FROM paket_umrah WHERE id = ?";
  db.query(selectSql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data", error: err });

    const flyer = results[0]?.flyer;
    if (flyer) {
      const filePath = path.join("uploads", flyer);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const deleteSql = "DELETE FROM paket_umrah WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) return res.status(500).json({ message: "Gagal menghapus paket", error: err });
      res.status(200).json({ message: "Paket berhasil dihapus" });
    });
  });
};