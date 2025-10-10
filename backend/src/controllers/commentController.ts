import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {getUserRole} from "./projectMemberController"
import { logActivity } from "./activityController";
// 🟢 Create a new comment
export const createComment = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { fileId, text, lineNumber, parentId } = req.body;

  try {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).json({ error: "File not found" });

    const role = await getUserRole(userId, file.projectId);
    if (!role) return res.status(403).json({ error: "Not authorized" });

    const comment = await prisma.comment.create({
      data: {
        fileId,
        authorId: userId,
        text,
        lineNumber,
        parentId,
      },
      include: {
        author: { select: { id: true, username: true, email: true } },
        replies: true,
      },
    });

    // log the activity
    await logActivity(
      userId,
      file.projectId,
      "comment_create",
      `${userId} commented on ${file.name}`
    );

    res.status(201).json(comment);
  } catch (err: any) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment", detail: err.message });
  }
};

// 🟡 Get all comments for a specific file
export const getCommentsByFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { fileId, parentId: null },
      include: {
        author: { select: { id: true, username: true } },
        replies: {
          include: { author: { select: { id: true, username: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (err: any) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments", detail: err.message });
  }
};

// 🟠 Resolve (mark as done) a comment
export const resolveComment = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const file = await prisma.file.findUnique({ where: { id: comment.fileId } });
    if (!file) return res.status(404).json({ error: "File not found" });

    const role = await getUserRole(userId, file.projectId);
    if (!role || (role !== "owner" && role !== "editor")) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { resolved: true },
    });

    res.json(updated);
  } catch (err: any) {
    console.error("Error resolving comment:", err);
    res.status(500).json({ error: "Failed to resolve comment", detail: err.message });
  }
};
