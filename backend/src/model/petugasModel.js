import db from "../config/db.js";

const Petugas = {
  create: async (data) => {
    const [result] = await db.promise().query(
      `
      INSERT INTO users
      (
        nama,
        email,
        password,
        nomor_hp,
        role
      )
      VALUES (?,?,?,?,?)
      `,
      [data.nama, data.email, data.password, data.nomor_hp, "petugas"],
    );

    return result;
  },

  getAll: async () => {
  const [rows] = await db.promise().query(`
      SELECT
          u.id,
          u.nama,
          u.email,
          u.nomor_hp,
          COUNT(pp.id) AS jumlah_penugasan
      FROM users u
      LEFT JOIN penugasan_petugas pp
          ON pp.petugas_id = u.id
      WHERE u.role='petugas'
      GROUP BY
          u.id,
          u.nama,
          u.email,
          u.nomor_hp
      ORDER BY u.nama
  `);

  return rows;
},

getById: async (id) => {
  const [rows] = await db.promise().query(
    `
    SELECT
      id,
      nama,
      email,
      nomor_hp
    FROM users
    WHERE id = ?
      AND role = 'petugas'
    `,
    [id]
  );

  return rows[0];
},

};

export default Petugas;
