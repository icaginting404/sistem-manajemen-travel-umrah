import express from "express";
import { create, getAll, getById } from "../controllers/petugas.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);

export default router;
