import { Request, Response } from "express";
import  prisma from "../lib/prisma"; 

//  Create a new file version (called when saving/editing)
export const createFileVersion = async (req: Request, res: Response) => {
  try {
    const { fileId, content } = req.body;
    const userId = (req as any).user?.id;

    if (!fileId || !content) {
      return res.status(400).json({ message: "fileId and content are required" });
    }

    // Check if file exists
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Create version entry
    const version = await prisma.fileVersion.create({
      data: {
        fileId,
        content,
        authorId: userId,
      },
    });

    res.status(201).json({ message: "File version created successfully", version });
  } catch (error) {
    console.error("Error creating file version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🧠 Get all versions for a specific file
export const getFileVersions = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    const versions = await prisma.fileVersion.findMany({
      where: { fileId },
      include: {
        author: { select: { id: true, username: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(versions);
  } catch (error) {
    console.error("Error fetching file versions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🧠 Restore a specific file version
export const restoreFileVersion = async (req: Request, res: Response) => {
  try {
    const { versionId } = req.params;
    const userId = (req as any).user?.id;

    const version = await prisma.fileVersion.findUnique({
      where: { id: versionId },
      include: { file: true },
    });

    if (!version) return res.status(404).json({ message: "Version not found" });

    // Update file content with this version
    const updatedFile = await prisma.file.update({
      where: { id: version.fileId },
      data: { content: version.content },
    });

    // Create a new version to record this "restore" action
    await prisma.fileVersion.create({
      data: {
        fileId: version.fileId,
        content: version.content,
        authorId: userId,
      },
    });

    res.json({ message: "File restored successfully", file: updatedFile });
  } catch (error) {
    console.error("Error restoring version:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
