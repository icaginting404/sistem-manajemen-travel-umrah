import express from "express";
import { getAdminContact } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/contact", getAdminContact);

export default router;