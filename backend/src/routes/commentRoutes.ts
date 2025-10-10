import express from "express";
import { isAuthenticated } from "../middleware/authGuard";
import {
  createComment,
  getCommentsByFile,
  resolveComment,
} from "../controllers/commentController";

const router = express.Router();

router.post("/", isAuthenticated, createComment); // create a new comment
router.get("/:fileId", isAuthenticated, getCommentsByFile); // get all comments for a file
router.patch("/:id/resolve", isAuthenticated, resolveComment); // mark comment as resolved

export default router;
