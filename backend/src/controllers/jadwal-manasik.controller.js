import db from "../config/db.js";

// GET ALL
export const getAllJadwalManasik = (req, res) => {
    const sql = `
        SELECT
        jm.*,
        pu.nama_paket,
        pu.jadwal_keberangkatan
        FROM jadwal_manasik jm
        JOIN paket_umrah pu
        ON jm.paket_id = pu.id
        ORDER BY jm.tanggal_acara ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal mengambil jadwal manasik",
                error: err,
            });
        }

        res.status(200).json(results);
    });
};

// GET BY ID
export const getJadwalManasikById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT
        jm.*,
        pu.nama_paket,
        pu.jadwal_keberangkatan
        FROM jadwal_manasik jm
        JOIN paket_umrah pu
        ON jm.paket_id = pu.id
        WHERE jm.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal mengambil data",
                error: err,
            });
        }

        if (results.length === 0) {
        return res.status(404).json({
            message: "Jadwal manasik tidak ditemukan",
        });
        }

        res.status(200).json(results[0]);
    });
};

// CREATE
export const createJadwalManasik = (req, res) => {
    const {
        paket_id,
        lokasi_acara,
        tanggal_acara,
        waktu_acara,
        pemateri,
        keterangan,
    } = req.body;

    const sql = `
        INSERT INTO jadwal_manasik (
        paket_id,
        lokasi_acara,
        tanggal_acara,
        waktu_acara,
        pemateri,
        keterangan
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        paket_id,
        lokasi_acara,
        tanggal_acara,
        waktu_acara,
        pemateri,
        keterangan,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal menambahkan jadwal manasik",
                error: err.message,
            });
        }

        res.status(201).json({
            message: "Jadwal manasik berhasil ditambahkan",
            id: result.insertId,
        });
    });
};

// UPDATE
export const updateJadwalManasik = (req, res) => {
    const { id } = req.params;

    const {
        paket_id,
        lokasi_acara,
        tanggal_acara,
        waktu_acara,
        pemateri,
        keterangan,
    } = req.body;

    const sql = `
        UPDATE jadwal_manasik
        SET
        paket_id = ?,
        lokasi_acara = ?,
        tanggal_acara = ?,
        waktu_acara = ?,
        pemateri = ?,
        keterangan = ?
        WHERE id = ?
    `;

    const values = [
        paket_id,
        lokasi_acara,
        tanggal_acara,
        waktu_acara,
        pemateri,
        keterangan,
        id,
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal mengupdate jadwal manasik",
                error: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Jadwal manasik tidak ditemukan",
            });
        }

        res.status(200).json({
            message: "Jadwal manasik berhasil diupdate",
        });
    });
};

// DELETE
export const deleteJadwalManasik = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM jadwal_manasik
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal menghapus jadwal manasik",
                error: err,
            });
        }

        res.status(200).json({
            message: "Jadwal manasik berhasil dihapus",
        });
    });
};

export const getJadwalManasikByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await db.promise().query(
            `
                SELECT DISTINCT
                    jm.id,
                    jm.lokasi_acara,
                    jm.tanggal_acara,
                    jm.waktu_acara,
                    jm.pemateri,
                    jm.keterangan,

                    pu.nama_paket,
                    pu.jadwal_keberangkatan

                FROM jadwal_manasik jm

                JOIN paket_umrah pu
                    ON pu.id = jm.paket_id

                JOIN pesanan p
                    ON p.paket_umrah_id = pu.id

                WHERE
                    p.user_id = ?
                    AND p.status_pesanan IN (
                        'menunggu_pembayaran',
                        'dalam_cicilan',
                        'lunas'
                    )

                ORDER BY jm.tanggal_acara ASC
            `,
            [userId]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Terjadi kesalahan",
        });
    }
};