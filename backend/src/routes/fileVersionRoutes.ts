import express from "express";
import { isAuthenticated } from "../middleware/authGuard";
import {
  createFileVersion,
  getFileVersions,
  restoreFileVersion,
} from "../controllers/fileVersionController";

const router = express.Router();

// Create new file version
router.post("/", isAuthenticated, createFileVersion);

// Get all versions for a file
router.get("/:fileId", isAuthenticated, getFileVersions);

// Restore specific version
router.post("/restore/:versionId", isAuthenticated, restoreFileVersion);

export default router;
