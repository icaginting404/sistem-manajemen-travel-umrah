import express from "express";

import {
    createPesanan,
    getPesananByUser,
    getDetailPesanan,
    getAllPesanan,
    createSnapToken,
    handleNotification,
    getDaftarPaket,
    tambahPembayaranAdmin,
    deletePesanan,
} from "../controllers/pesanan.controller.js";

const router = express.Router();

router.post("/", createPesanan);
router.get("/paket", getDaftarPaket);
router.get("/", getAllPesanan);
router.get("/user/:userId", getPesananByUser);
router.delete("/:id", deletePesanan);
router.post("/:id/payment", createSnapToken);
router.post("/notification", handleNotification);
router.post("/:id/admin-payment", tambahPembayaranAdmin);
router.get("/:id", getDetailPesanan);

export default router;