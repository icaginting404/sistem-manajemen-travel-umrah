import db from "../config/db.js";

const BiayaOperasional = {
  // Tambah biaya operasional
  create: async (data) => {
    const [result] = await db.promise().query(
      `
      INSERT INTO biaya_operasional
      (
        paket_umrah_id,
        petugas_id,
        tanggal,
        keterangan,
        nominal,
        bukti,
        dibayar_oleh
      )
      VALUES (?,?,?,?,?,?,?)
      `,
      [
        data.paket_umrah_id,
        data.petugas_id,
        data.tanggal,
        data.keterangan,
        data.nominal,
        data.bukti,
        data.dibayar_oleh,
      ],
    );

    return result;
  },

  // Admin melihat semua biaya operasional
  getAll: async (paketId) => {
    const [rows] = await db.promise().query(
      `
    SELECT
      bo.*,
      pu.nama_paket,
      u.nama AS nama_petugas
    FROM biaya_operasional bo
    INNER JOIN paket_umrah pu
      ON pu.id = bo.paket_umrah_id
    LEFT JOIN users u
      ON u.id = bo.petugas_id
    WHERE bo.paket_umrah_id = ?
    ORDER BY bo.tanggal DESC
    `,
      [paketId],
    );

    return rows;
  },

  // Petugas hanya melihat miliknya sendiri
  getByPetugas: async (petugasId, paketId) => {
    const [rows] = await db.promise().query(
      `
    SELECT
      bo.*,
      pu.nama_paket
    FROM biaya_operasional bo
    INNER JOIN paket_umrah pu
      ON pu.id = bo.paket_umrah_id
    WHERE
      bo.petugas_id = ?
      AND bo.paket_umrah_id = ?
    ORDER BY bo.tanggal DESC
    `,
      [petugasId, paketId], // <-- HARUS DUA
    );

    return rows;
  },
  // Detail
  getById: async (id) => {
    const [rows] = await db.promise().query(
      `
      SELECT
        bo.*,
        pu.nama_paket,
        u.nama AS nama_petugas
      FROM biaya_operasional bo
      INNER JOIN paket_umrah pu
        ON pu.id = bo.paket_umrah_id
      LEFT JOIN users u
        ON u.id = bo.petugas_id
      WHERE bo.id = ?
      `,
      [id],
    );

    return rows[0];
  },

  // Edit
  update: async (id, data) => {
    const [result] = await db.promise().query(
      `
      UPDATE biaya_operasional
      SET
        tanggal = ?,
        keterangan = ?,
        nominal = ?,
        bukti = ?
      WHERE id = ?
      `,
      [data.tanggal, data.keterangan, data.nominal, data.bukti, id],
    );

    return result;
  },

  // Hapus
  remove: async (id) => {
    const [result] = await db.promise().query(
      `
      DELETE FROM biaya_operasional
      WHERE id = ?
      `,
      [id],
    );

    return result;
  },
};

export default BiayaOperasional;
