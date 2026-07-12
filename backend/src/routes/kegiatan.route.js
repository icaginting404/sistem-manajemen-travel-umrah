import express from "express";

import {
  createKegiatan,
  getKegiatan,
  getDetailKegiatan,
  getDetailKegiatanById,
  updateKegiatan,
  updateDetailKegiatan,
  deleteKegiatan,
  deleteDetailKegiatan,
  uploadDokumentasi as uploadDoukumentasiController,
  getGaleri,
  getGaleriById,
} from "../controllers/kegiatan.controller.js";
import { uploadDokumentasi } from "../middlewares/uploadDokumentasi.js";

const kegiatanRoute = express.Router();

kegiatanRoute.post("/", createKegiatan);
kegiatanRoute.get("/", getKegiatan);
kegiatanRoute.get("/galeri", getGaleri);
kegiatanRoute.get("/detail/:id", getDetailKegiatanById);
kegiatanRoute.put("/detail/:id", updateDetailKegiatan);
kegiatanRoute.delete("/detail/:id", deleteDetailKegiatan);
kegiatanRoute.get("/:id", getDetailKegiatan);
kegiatanRoute.put("/:id", updateKegiatan);
kegiatanRoute.delete("/:id", deleteKegiatan);
kegiatanRoute.post(
  "/detail/:id/dokumentasi",
  uploadDokumentasi.single("dokumentasi"),
  uploadDoukumentasiController,
);
kegiatanRoute.get("/galeri/:id", getGaleriById);
export default kegiatanRoute;
