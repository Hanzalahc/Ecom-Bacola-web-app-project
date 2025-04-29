import express from "express";
const router = express.Router();
import { getStats } from "../controllers/Stats.js";

router.get("/data", getStats);

export default router;
