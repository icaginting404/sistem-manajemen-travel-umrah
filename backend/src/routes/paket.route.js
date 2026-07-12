import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllPaket,
  getPaketById,
  createPaket,
  updatePaket,
  deletePaket,
} from "../controllers/paket.controller.js";

const router = express.Router();

//Multer Config (Upload Flyer)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error("Hanya file gambar (jpg, png) atau PDF yang diperbolehkan"));
};

const upload = multer({ storage, fileFilter });

//Routes

router.get("/", getAllPaket);
router.get("/:id", getPaketById);
router.post("/", upload.single("flyer"), createPaket);
router.put("/:id", upload.single("flyer"), updatePaket);
router.delete("/:id", deletePaket);

export default router;