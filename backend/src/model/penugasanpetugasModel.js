import db from "../config/db.js";

const PenugasanPetugas = {
  getByPetugas: async (petugasId) => {
    const [rows] = await db.promise().query(
      `
      SELECT
        pp.id,
        pu.id AS paket_id,
        pu.nama_paket,
        pp.created_at
      FROM penugasan_petugas pp
      INNER JOIN paket_umrah pu
        ON pu.id = pp.paket_umrah_id
      WHERE pp.petugas_id = ?
      ORDER BY pp.created_at DESC
      `,
      [petugasId],
    );

    return rows;
  },

  checkDuplicate: async (petugasId, paketId) => {
    const [rows] = await db.promise().query(
      `
      SELECT id
      FROM penugasan_petugas
      WHERE petugas_id = ?
      AND paket_umrah_id = ?
      `,
      [petugasId, paketId],
    );

    return rows[0];
  },

  create: async (data) => {
    const [result] = await db.promise().query(
      `
      INSERT INTO penugasan_petugas
      (
        petugas_id,
        paket_umrah_id
      )
      VALUES (?,?)
      `,
      [data.petugas_id, data.paket_umrah_id],
    );

    return result;
  },

  delete: async (id) => {
    const [result] = await db.promise().query(
      `
    DELETE FROM penugasan_petugas
    WHERE id = ?
    `,
      [id],
    );

    return result;
  },
};

export default PenugasanPetugas;
