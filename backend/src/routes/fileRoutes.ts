// src/routes/fileRoutes.ts
import { Router } from "express";
import { isAuthenticated } from "../middleware/authGuard";
import {
  createFile,
  getFiles,
  updateFile,
  deleteFile,
} from "../controllers/fileController";

const router = Router();

// Create a new file/folder
router.post("/", isAuthenticated, createFile);

// Get all files of a project
router.get("/:projectId", isAuthenticated, getFiles);

// Update a file (by id)
router.put("/:id", isAuthenticated, updateFile);

// Delete a file (by id)
router.delete("/:id", isAuthenticated, deleteFile);

export default router;
