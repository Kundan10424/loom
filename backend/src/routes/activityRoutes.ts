import express from "express";
import { isAuthenticated } from "../middleware/authGuard";
import { getProjectActivity } from "../controllers/activityController";

const router = express.Router();
router.get("/:projectId", isAuthenticated, getProjectActivity);

export default router;
