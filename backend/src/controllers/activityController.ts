import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { getUserRole } from "./projectMemberController";
// 🟢 Get all activities for a project
export const getProjectActivity = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId } = req.params;

  try {
    const role = await getUserRole(userId, projectId);
    if (!role) return res.status(403).json({ error: "Not authorized" });

    const activities = await prisma.activity.findMany({
      where: { projectId },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json(activities);
  } catch (err: any) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ error: "Failed to fetch activity", detail: err.message });
  }
};

// 🟡 (Helper) Create new activity entry
export const logActivity = async (
  userId: string,
  projectId: string,
  type: string,
  message: string
) => {
  try {
    await prisma.activity.create({
      data: { userId, projectId, type, message },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};
