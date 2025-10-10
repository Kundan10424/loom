import { Request, Response } from "express";
import prisma from "../lib/prisma";
import {logActivity} from "./activityController"

// Utility: check if user is a member of the project & return role
async function getUserRole(userId: string, projectId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId, projectId }
    }
  });
  return membership?.role;
}

// Create new file/folder
export async function createFile(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { projectId, name, type, parentId } = req.body;

  if (!projectId || !name || !type) {
    return res.status(400).json({ error: "projectId, name, and type are required" });
  }

  try {
    const role = await getUserRole(userId, projectId);
    if (!role || (role !== "owner" && role !== "editor")) {
      return res.status(403).json({ error: "Not authorized to create files" });
    }

    const file = await prisma.file.create({
      data: { name, type, projectId, parentId }
    });

    res.status(201).json(file);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create file", detail: err.message });
  }
}

// Get all files for a project
export async function getFiles(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { projectId } = req.params;

  try {
    const role = await getUserRole(userId, projectId);
    if (!role) {
      return res.status(403).json({ error: "Not authorized to view files" });
    }

    const files = await prisma.file.findMany({
      where: { projectId },
      include: { children: true }
    });

    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch files", detail: err.message });
  }
}

// Update file (name or content)
// export async function updateFile(req: Request, res: Response) {
//   const userId = (req as any).user?.id;
//   const { id } = req.params;
//   const { name, content } = req.body;

//   try {
//     const file = await prisma.file.findUnique({ where: { id } });
//     if (!file) return res.status(404).json({ error: "File not found" });

//     const role = await getUserRole(userId, file.projectId);
//     if (!role || (role !== "owner" && role !== "editor")) {
//       return res.status(403).json({ error: "Not authorized to update files" });
//     }

//     const updated = await prisma.file.update({
//       where: { id },
//       data: { name, content }
//     });

//     res.json(updated);
//   } catch (err: any) {
//     res.status(500).json({ error: "Failed to update file", detail: err.message });
//   }
// }

export async function updateFile(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { id } = req.params;
  const { name, content } = req.body;

  try {
    //  Fetch the file
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: "File not found" });

    //  Role validation
    const role = await getUserRole(userId, file.projectId);
    if (!role || (role !== "owner" && role !== "editor")) {
      return res.status(403).json({ error: "Not authorized to update files" });
    }

    //  Update the file content or name
    const updated = await prisma.file.update({
      where: { id },
      data: { name, content },
    });

    // log the activity
    await logActivity(
      userId,
      file.projectId,
      "file_edit",
      `${userId} edited ${file.name}`
    )

    //  Auto-create a version if content changed
    if (content && content !== file.content) {
      await prisma.fileVersion.create({
        data: {
          fileId: id,
          content,
          authorId: userId,
        },
      });
    }

    //  Respond to client
    res.json({
      message: "File updated successfully",
      file: updated,
    });
  } catch (err: any) {
    console.error("Error updating file:", err);
    res.status(500).json({ error: "Failed to update file", detail: err.message });
  }
}


// Delete file
export async function deleteFile(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: "File not found" });

    const role = await getUserRole(userId, file.projectId);
    if (!role || role !== "owner") {
      return res.status(403).json({ error: "Only owner can delete files" });
    }

    await prisma.file.delete({ where: { id } });
    res.json({ message: "File deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete file", detail: err.message });
  }
}
