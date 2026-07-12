import express from "express";

import {
  getAllJamaah,
  getJamaahById,
  deleteJamaah,
  getJamaahByPaket,
  getStatusPaketJamaah,
  getJadwalKegiatanJamaah,
} from "../controllers/jamaah.controller.js";

const router = express.Router();

router.get("/", getAllJamaah);
router.get("/paket/:paketId", getJamaahByPaket);
router.get("/status-paket/:id", getStatusPaketJamaah);
router.get("/jadwal/:id", getJadwalKegiatanJamaah);
router.get("/:id", getJamaahById);
router.delete("/:id", deleteJamaah);

export default router;
