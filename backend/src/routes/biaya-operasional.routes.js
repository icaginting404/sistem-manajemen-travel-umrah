import express from "express";
import {
  create,
  createPetugas,
  getAll,
  getByPetugas,
  getById,
  update,
  remove,
} from "../controllers/biaya-operasional.controller.js";

import upload from "../middlewares/uploadBiayaOperasional.js";

const router = express.Router();

// Admin
router.post("/", upload.single("bukti"), create);
router.get("/", getAll);

// Petugas
router.post("/petugas", upload.single("bukti"), createPetugas);
router.get("/petugas", getByPetugas);

// Detail
router.get("/:id", getById);

// Edit
router.put("/:id", upload.single("bukti"), update);

// Hapus
router.delete("/:id", remove);

export default router;