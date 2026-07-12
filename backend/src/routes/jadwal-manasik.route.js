import express from "express";

import {
  getAllJadwalManasik,
  getJadwalManasikById,
  createJadwalManasik,
  updateJadwalManasik,
  deleteJadwalManasik,
  getJadwalManasikByUser,
} from "../controllers/jadwal-manasik.controller.js";

const router = express.Router();

router.get("/", getAllJadwalManasik);
router.get("/user/:userId", getJadwalManasikByUser);
router.get("/:id", getJadwalManasikById);
router.post("/", createJadwalManasik);
router.put("/:id", updateJadwalManasik);
router.delete("/:id", deleteJadwalManasik);

export default router;