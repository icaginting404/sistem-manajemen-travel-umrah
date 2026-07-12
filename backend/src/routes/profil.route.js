import express from "express";
import {
  getProfilJamaah,
  simpanProfilJamaah,
  upload,
} from "../controllers/profil-jamaah.controller.js";

const router = express.Router();

router.get("/:userId", getProfilJamaah);

router.post(
  "/",
  upload.fields([
    { name: "paspor", maxCount: 1 },
    { name: "buku_nikah", maxCount: 1 },
    { name: "buku_vaksin", maxCount: 1 },
    { name: "pas_foto", maxCount: 1 },
    { name: "akta_lahir", maxCount: 1 },
    { name: "lainnya", maxCount: 10 },
  ]),
  simpanProfilJamaah
);

router.put(
  "/:id",
  upload.fields([
    { name: "paspor", maxCount: 1 },
    { name: "buku_nikah", maxCount: 1 },
    { name: "buku_vaksin", maxCount: 1 },
    { name: "pas_foto", maxCount: 1 },
    { name: "akta_lahir", maxCount: 1 },
    { name: "lainnya", maxCount: 10 },
  ]),
  simpanProfilJamaah
);

export default router;