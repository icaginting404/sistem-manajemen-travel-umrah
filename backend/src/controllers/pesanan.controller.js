import db from "../config/db.js";
import snap, { coreApi } from "../config/midtrans.js";

export const createPesanan = async (req, res) => {
    try {
        const {
            user_id,
            paket_umrah_id,
            jenis_pembayaran
        } = req.body;

        const [paket] = await db.promise().query(
            `SELECT * FROM paket_umrah WHERE id = ?`,
            [paket_umrah_id]
        );

        if (paket.length === 0) {
            return res.status(404).json({
                message: "Paket tidak ditemukan"
            });
        }

        const dataPaket = paket[0];

        if (dataPaket.status_paket.toLowerCase() !== "aktif") {
            return res.status(400).json({
                message: "Paket tidak dapat dipesan."
            });
        }

        const [jumlahPeserta] = await db.promise().query(
            `
                SELECT COUNT(*) AS total
                FROM pesanan
                WHERE paket_umrah_id=?
                AND status_pesanan IN (
                    'menunggu_pembayaran',
                    'dalam_cicilan',
                    'lunas'
                )
            `,
            [paket_umrah_id]
        );

        if (jumlahPeserta[0].total >= dataPaket.total_kuota) {
            return res.status(400).json({
                message: "Kuota paket sudah penuh."
            });
        }
        const hargaPaket = Number(dataPaket.harga);
        const kodePesanan = "UMR-" + Date.now();

        //digunakan untuk membulatkan nominal
        const nominalDp = Math.round(hargaPaket * 0.15);
        
        const totalDibayar = 0;
        const sisaTagihan = hargaPaket;

        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 24);

        const [existingPesanan] = await db.promise().query(
            `
                SELECT id
                FROM pesanan
                WHERE user_id = ?
                AND paket_umrah_id = ?
                AND status_pesanan IN (
                    'menunggu_pembayaran',
                    'dalam_cicilan',
                    'lunas'
                )
            `,
            [user_id, paket_umrah_id]
        );

        if (existingPesanan.length > 0) {
            return res.status(400).json({
                message: "Anda sudah memiliki atau pernah menyelesaikan pemesanan untuk paket ini.",
            });
        }

        const [result] = await db.promise().query(
            `
                INSERT INTO pesanan (
                    kode_pesanan,
                    user_id,
                    paket_umrah_id,
                    harga_paket,
                    nominal_dp,
                    total_dibayar,
                    sisa_tagihan,
                    status_pesanan,
                    jenis_pembayaran_awal,
                    expired_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                kodePesanan,
                user_id,
                paket_umrah_id,
                hargaPaket,
                nominalDp,
                totalDibayar,
                sisaTagihan,
                "menunggu_pembayaran",
                jenis_pembayaran,
                expiredAt
            ]
        );

        res.status(201).json({
            message: "Pesanan berhasil dibuat",
            id: result.insertId,
            kode_pesanan: kodePesanan
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message || "Terjadi kesalahan"
        });
    }
};

export const getPesananByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const [results] = await db.promise().query(
            `
                SELECT
                    p.id,
                    p.kode_pesanan,
                    p.tanggal_pesan,
                    p.harga_paket,
                    p.total_dibayar,
                    p.sisa_tagihan,
                    p.status_pesanan,

                    u.nama,
                    u.email,

                    pu.nama_paket,
                    pu.flyer

                FROM pesanan p

                JOIN users u
                ON u.id = p.user_id

                JOIN paket_umrah pu
                ON pu.id = p.paket_umrah_id

                WHERE p.user_id = ?

                ORDER BY p.created_at DESC
            `,
            [userId]
        );

        const formattedResults = results.map((item) => ({
            ...item,
            harga_paket: Number(item.harga_paket),
            total_dibayar: Number(item.total_dibayar),
            sisa_tagihan: Number(item.sisa_tagihan),
        }));

        res.json(formattedResults);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Terjadi kesalahan",
        });
    }
};

export const getDetailPesanan = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.promise().query(
            `
                SELECT
                    p.id,
                    p.kode_pesanan,
                    p.tanggal_pesan,
                    p.harga_paket,
                    p.total_dibayar,
                    p.sisa_tagihan,
                    p.status_pesanan,

                    u.nama,

                    pu.nama_paket,
                    pu.flyer,
                    pu.jadwal_keberangkatan,
                    pu.durasi_perjalanan,
                    pu.hotel,
                    pu.maskapai,
                    pu.total_kuota,
                    pu.fasilitas,
                    pu.tidak_termasuk_harga

                FROM pesanan p

                JOIN paket_umrah pu
                ON pu.id = p.paket_umrah_id

                JOIN users u
                ON u.id = p.user_id

                WHERE p.id = ?
            `,
            [id]
        );

        const [riwayat] = await db.promise().query(
            `
                SELECT
                    tanggal_bayar,
                    metode_pembayaran,
                    jumlah,
                    keterangan
                FROM pembayaran
                WHERE pesanan_id = ?
                AND status_pembayaran IN ('capture','settlement')
                ORDER BY tanggal_bayar ASC
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Data pesanan tidak ditemukan",
            });
        }

        const data = rows[0];

        data.harga_paket = Number(data.harga_paket);
        data.total_dibayar = Number(data.total_dibayar);
        data.sisa_tagihan = Number(data.sisa_tagihan);
        data.fasilitas = JSON.parse(data.fasilitas || "[]");
        data.tidak_termasuk_harga = JSON.parse(
            data.tidak_termasuk_harga || "[]"
        );

        data.riwayat_pembayaran = riwayat.map((item) => ({
            tanggal: item.tanggal_bayar,
            metode:
                item.metode_pembayaran === "bank_transfer"
                    ? "Transfer Bank"
                    : item.metode_pembayaran === "credit_card"
                    ? "Kartu Kredit"
                    : item.metode_pembayaran === "qris"
                    ? "QRIS"
                    : item.metode_pembayaran === "gopay"
                    ? "GoPay"
                    : item.metode_pembayaran === "shopeepay"
                    ? "ShopeePay"
                    : item.metode_pembayaran === "cash"
                    ? "Tunai"
                    : item.metode_pembayaran ?? "-",
            jumlah: Number(item.jumlah),
            keterangan: item.keterangan,
        }));

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Terjadi kesalahan",
        });
    }
};

export const getAllPesanan = async (req, res) => {
    try {
        const { paket, status } = req.query;

        let sql = `
            SELECT
                p.id,
                p.kode_pesanan,
                p.harga_paket,
                p.total_dibayar,
                p.sisa_tagihan,
                p.status_pesanan,

                u.nama,
                pu.nama_paket

            FROM pesanan p

            JOIN users u
            ON u.id = p.user_id

            JOIN paket_umrah pu
            ON pu.id = p.paket_umrah_id
        `;

        const params = [];
        const conditions = [];

        if (paket) {
            conditions.push("p.paket_umrah_id = ?");
            params.push(paket);
        }

        if (status) {
            conditions.push("p.status_pesanan = ?");
            params.push(status);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " ORDER BY p.created_at DESC";

        const [rows] = await db.promise().query(sql, params);

        const data = rows.map(item => ({
            ...item,
            harga_paket: Number(item.harga_paket),
            total_dibayar: Number(item.total_dibayar),
            sisa_tagihan: Number(item.sisa_tagihan),
        }));

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Terjadi kesalahan",
        });
    }
};

export const getDaftarPaket = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                id,
                nama_paket
            FROM paket_umrah
            ORDER BY jadwal_keberangkatan DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Terjadi kesalahan",
        });
    }
};

export const createSnapToken = async (req, res) => {
    try {
        const { id } = req.params;
        const { jumlah } = req.body;

        const [rows] = await db.promise().query(
            `
                SELECT
                    p.id,
                    p.kode_pesanan,
                    nominal_dp,
                    p.harga_paket,
                    p.total_dibayar,
                    p.sisa_tagihan,
                    p.status_pesanan,
                    p.jenis_pembayaran_awal,
                    u.nama,
                    u.email
                FROM pesanan p
                JOIN users u
                    ON u.id = p.user_id
                WHERE p.id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Pesanan tidak ditemukan",
            });
        }

        const pesanan = rows[0];

        const [paymentRows] = await db.promise().query(
            `
                SELECT *
                FROM pembayaran
                WHERE pesanan_id = ?
                ORDER BY id DESC
                LIMIT 1
            `,
            [pesanan.id]
        );

        //Mentukan jenis pembayaran
        const pembayaranPertama =
            Number(pesanan.total_dibayar) === 0;

        const pembayaran = paymentRows[0];

        if (pembayaran) {

            if (
                pembayaranPertama &&
                pesanan.jenis_pembayaran_awal === "dp"
            ) {

                const tokenMasihBerlaku =
                    pembayaran.created_at &&
                    (Date.now() - new Date(pembayaran.created_at).getTime()) <
                    24 * 60 * 60 * 1000;

                if (pembayaran.snap_token && tokenMasihBerlaku) {
                    return res.json({
                        token: pembayaran.snap_token,
                        isExisting: true,
                    });
                }
            }

            // Hanya expire jika pembayaran sebelumnya BELUM berhasil
            if (
                pembayaran.status_pembayaran !== "capture" &&
                pembayaran.status_pembayaran !== "settlement"
            ) {
                await db.promise().query(
                    `
                    UPDATE pembayaran
                    SET
                        status_pembayaran='expire',
                        snap_token=NULL
                    WHERE id=?
                    `,
                    [pembayaran.id]
                );
            }
        }

        if (pesanan.status_pesanan === "expired") {
            return res.status(400).json({
                message: "Pesanan sudah kedaluwarsa.",
            });
        }

        if (pesanan.status_pesanan === "dibatalkan") {
            return res.status(400).json({
                message: "Pesanan sudah dibatalkan.",
            });
        }

        if (pesanan.status_pesanan === "lunas") {
            return res.status(400).json({
                message: "Pesanan sudah lunas.",
            });
        }

        let jumlahBayar;

        if (pembayaranPertama) {

            if (pesanan.jenis_pembayaran_awal === "lunas") {
                jumlahBayar = Number(pesanan.harga_paket);
            } else {
                jumlahBayar = Number(pesanan.nominal_dp);
            }

        } else {
            
            if (!jumlah) {
                return res.status(400).json({
                    message: "Nominal pembayaran harus diisi.",
                });
            }

            jumlahBayar = Number(jumlah);

            if (jumlahBayar <= 0) {
                return res.status(400).json({
                    message: "Nominal tidak valid.",
                });
            }

            if (jumlahBayar < 20000) {
                return res.status(400).json({
                    message: "Minimal pembayaran adalah Rp20.000.",
                });
            }

            if (jumlahBayar > Number(pesanan.sisa_tagihan)) {
                return res.status(400).json({
                    message: "Nominal melebihi sisa tagihan.",
                });
            }
        }

        const suffix = pembayaranPertama
            ? (
                pesanan.jenis_pembayaran_awal === "lunas"
                    ? "LUNAS"
                    : "DP"
            )
            : "CICIL";

        const parameter = {
            transaction_details: {
            order_id: `${pesanan.kode_pesanan}-${suffix}-${Date.now()}`,
                gross_amount: jumlahBayar,
            },
            customer_details: {
                first_name: pesanan.nama,
                email: pesanan.email,
            },
        };

        const transaction = await snap.createTransaction(parameter);
        await db.promise().query(
            `
                INSERT INTO pembayaran
                (
                    pesanan_id,
                    jumlah,
                    snap_token,
                    kode_transaksi,
                    keterangan
                )
                VALUES (?, ?, ?, ?, ?)
            `,
            [
                pesanan.id,
                jumlahBayar,
                transaction.token,
                parameter.transaction_details.order_id,
                "By Midtrans"
            ]
        );

        return res.status(200).json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message || "Terjadi kesalahan",
        });
    }
};

export const handleNotification = async (req, res) => {
    try {

        console.log("===== WEBHOOK MASUK =====");
        console.log(req.body);
        const statusResponse = await coreApi.transaction.notification(req.body);
        console.log("===== STATUS RESPONSE =====");
        console.log(statusResponse);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log("=== MIDTRANS NOTIFICATION ===");
        console.log(statusResponse);

        const parts = orderId.split("-");

        // buang timestamp Midtrans
        parts.pop();

        // buang DP / LUNAS / CICIL
        parts.pop();

        const kodePesanan = parts.join("-");

        const [rows] = await db.promise().query(
            `
                SELECT *
                FROM pesanan
                WHERE kode_pesanan = ?
            `,
            [kodePesanan]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Pesanan tidak ditemukan",
            });
        }

        const pesanan = rows[0];

        const [paymentRows] = await db.promise().query(
            `
                SELECT *
                FROM pembayaran
                WHERE kode_transaksi = ?
            `,
            [orderId]
        );

        if (paymentRows.length === 0) {
            return res.status(404).json({
                message: "Data pembayaran tidak ditemukan",
            });
        }

        const pembayaran = paymentRows[0];

        if (
            pembayaran.status_pembayaran === "settlement" ||
            pembayaran.status_pembayaran === "capture"
        ) {
            return res.status(200).json({
                message: "Already processed",
            });
        }

        let statusPesanan = pesanan.status_pesanan;
        let totalDibayar = Number(pesanan.total_dibayar);
        let sisaTagihan = Number(pesanan.sisa_tagihan);

        if (
            transactionStatus === "settlement" ||
            (transactionStatus === "capture" && fraudStatus === "accept")
        ) {
            totalDibayar =
                Number(pesanan.total_dibayar) +
                Number(pembayaran.jumlah);

            sisaTagihan =
                Number(pesanan.harga_paket) -
                totalDibayar;

            if (sisaTagihan <= 0) {
                sisaTagihan = 0;
                statusPesanan = "lunas";
            } else {
                statusPesanan = "dalam_cicilan";
            }

        } else if (
            transactionStatus === "pending" ||
            transactionStatus === "challenge"
        ) {

            statusPesanan = "menunggu_pembayaran";

        } else if (transactionStatus === "expire") {

            if (Number(pesanan.total_dibayar) === 0) {
                statusPesanan = "expired";
            }

        } else if (
            transactionStatus === "deny" ||
            transactionStatus === "cancel" ||
            transactionStatus === "failure"
        ) {

            statusPesanan = "dibatalkan";
        }

        await db.promise().query(
            `
                UPDATE pesanan
                SET
                    status_pesanan = ?,
                    total_dibayar = ?,
                    sisa_tagihan = ?
                WHERE id = ?
            `,
            [
                statusPesanan,
                totalDibayar,
                sisaTagihan,
                pesanan.id,
            ]
        );

        await db.promise().query(
            `
                UPDATE pembayaran
                SET
                    id_transaksi_midtrans=?,
                    status_pembayaran=?,
                    metode_pembayaran=?,
                    tanggal_bayar=?,
                    snap_token=NULL
                WHERE kode_transaksi=?
            `,
            [
                statusResponse.transaction_id,
                transactionStatus,
                statusResponse.payment_type,
                statusResponse.settlement_time || null,
                orderId
            ]
        );

        return res.status(200).json({
            message: "Notification processed",
        });

    } catch (error) {
        console.error("WEBHOOK ERROR");
        console.error(error);

        if (error.ApiResponse) {
            console.error(error.ApiResponse);
        }

        res.status(500).json({
            message: error.message,
        });
    }
};

export const tambahPembayaranAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { tanggal_bayar, jumlah } = req.body;

        const [rows] = await db.promise().query(
            `
            SELECT *
            FROM pesanan
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Pesanan tidak ditemukan",
            });
        }

        const pesanan = rows[0];

        if (
            pesanan.status_pesanan === "lunas" ||
            pesanan.status_pesanan === "dibatalkan"
        ) {
            return res.status(400).json({
                message: "Pesanan tidak dapat dibayar lagi",
            });
        }

        const nominal = Number(jumlah);

        if (nominal <= 0) {
            return res.status(400).json({
                message: "Nominal tidak valid",
            });
        }

        if (nominal > Number(pesanan.sisa_tagihan)) {
            return res.status(400).json({
                message: "Nominal melebihi sisa tagihan",
            });
        }

        const totalDibayar =
            Number(pesanan.total_dibayar) + nominal;

        let sisaTagihan =
            Number(pesanan.harga_paket) - totalDibayar;

        let statusPesanan = "dalam_cicilan";

        if (sisaTagihan <= 0) {
            sisaTagihan = 0;
            statusPesanan = "lunas";
        }

        await db.promise().query(
            `
                INSERT INTO pembayaran
                (
                    pesanan_id,
                    jumlah,
                    tanggal_bayar,
                    metode_pembayaran,
                    status_pembayaran,
                    keterangan
                )
                VALUES
                (
                    ?, ?, ?, ?, ?, ?
                )
            `,
            [
                id,
                nominal,
                tanggal_bayar,
                "cash",
                "settlement",
                "By Admin",
            ]
        );

        await db.promise().query(
            `
            UPDATE pesanan
            SET
                total_dibayar=?,
                sisa_tagihan=?,
                status_pesanan=?
            WHERE id=?
            `,
            [
                totalDibayar,
                sisaTagihan,
                statusPesanan,
                id,
            ]
        );

        res.json({
            message: "Pembayaran berhasil ditambahkan",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

export const deletePesanan = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.promise().query(
            `
            SELECT *
            FROM pesanan
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Pesanan tidak ditemukan",
            });
        }

        const pesanan = rows[0];

        if (
            pesanan.status_pesanan !== "menunggu_pembayaran" ||
            Number(pesanan.total_dibayar) > 0
        ) {
            return res.status(400).json({
                message:
                    "Pesanan tidak dapat dihapus karena sudah dilakukan pembayaran.",
            });
        }

        await db.promise().query(
            `
            DELETE FROM pembayaran
            WHERE pesanan_id = ?
            `,
            [id]
        );

        await db.promise().query(
            `
            DELETE FROM pesanan
            WHERE id = ?
            `,
            [id]
        );

        res.json({
            message: "Pesanan berhasil dihapus",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};