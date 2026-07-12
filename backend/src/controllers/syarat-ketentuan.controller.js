import db from "../config/db.js";

export const getAll = (req, res) => {
    db.query(
        "SELECT * FROM syarat_ketentuan ORDER BY id ASC",
        (err, rows) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Gagal mengambil data syarat & ketentuan",
                });
            }
            res.json(rows);
        }
    );
};