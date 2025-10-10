import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Create a new project
export async function createProject(req: Request, res: Response) {
  const { name, type } = req.body;
  const userId = (req as any).user?.id; // injected by auth middleware

  if (!name || !type) {
    return res.status(400).json({ error: "Name and type are required" });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        type,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "owner",
          },
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create project", detail: err.message });
  }
}

// Get all projects of the logged-in user
export async function getProjects(req: Request, res: Response) {
  const userId = (req as any).user?.id;

  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: { files: true, members: true },
    });

    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch projects", detail: err.message });
  }
}

// Get a single project by id
export async function getProjectById(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id,
        members: { some: { userId } },
      },
      include: { files: true, members: true },
    });

    if (!project) return res.status(404).json({ error: "Project not found or no access" });

    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch project", detail: err.message });
  }
}

// Update project (only owner)
export async function updateProject(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { id } = req.params;
  const { name, type } = req.body;

  try {
    // check if user is owner
    const membership = await prisma.projectMember.findFirst({
      where: { projectId: id, userId, role: "owner" },
    });

    if (!membership) {
      return res.status(403).json({ error: "Only owner can update project" });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { name, type },
    });

    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update project", detail: err.message });
  }
}

// Delete a project (only owner)
export async function deleteProject(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  try {
    // check if user is owner
    const membership = await prisma.projectMember.findFirst({
      where: { projectId: id, userId, role: "owner" },
    });

    if (!membership) {
      return res.status(403).json({ error: "Only owner can delete project" });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete project", detail: err.message });
  }
}
