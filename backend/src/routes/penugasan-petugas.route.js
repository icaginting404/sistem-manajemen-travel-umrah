import express from "express";
import {
  create,
  getByPetugas,
  remove,
} from "../controllers/penugasan-petugas.controller.js";

const router = express.Router();

router.get("/:petugasId", getByPetugas);

router.post("/", create);
router.delete("/:id", remove);

export default router;
