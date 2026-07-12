import db from "../config/db.js";

export const getAdminContact = (req, res) => {
  const sql = `
    SELECT nomor_hp
    FROM users
    WHERE role = 'admin'
    LIMIT 1
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Server error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Admin tidak ditemukan",
      });
    }

    return res.status(200).json(result[0]);
  });
};