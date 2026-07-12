import express from "express";
import { getAll } from "../controllers/syarat-ketentuan.controller.js";

const router = express.Router();

router.get("/", getAll);

export default router;