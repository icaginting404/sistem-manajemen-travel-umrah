import express from "express";
import { getDashboardOwner, getChartOwner } from "../controllers/owner.controller.js";

const router = express.Router();

router.get("/dashboard", getDashboardOwner);
router.get("/chart", getChartOwner);

export default router;