import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { isAuthenticated } from "../middleware/authGuard";

const router = Router();

// Create a project
router.post("/", isAuthenticated, createProject);

// Get all projects of logged-in user
router.get("/", isAuthenticated, getProjects);

// Get a single project by ID
router.get("/:id", isAuthenticated, getProjectById);

// Update a project
router.put("/:id", isAuthenticated, updateProject);

// Delete a project
router.delete("/:id", isAuthenticated, deleteProject);

export default router;
