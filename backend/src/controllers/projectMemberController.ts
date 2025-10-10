import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authGuard";
import jwt from "jsonwebtoken";

// Utility: check user role
 export async function getUserRole(userId: string, projectId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return membership?.role;
}

// Add member (manual by email)
export async function addMember(req: Request, res: Response) {
  const { userId } = (req as AuthRequest).user || {};
  const { projectId } = req.params;
  const { email, role } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const currentRole = await getUserRole(userId, projectId);
    if (currentRole !== "owner") {
      return res.status(403).json({ message: "Only owner can add members" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const member = await prisma.projectMember.create({
      data: {
        role: role || "viewer",
        userId: user.id,
        projectId,
      },
    });

    return res.status(201).json(member);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to add member", detail: err.message });
  }
}

// Generate invite link
export async function generateInviteLink(req: Request, res: Response) {
  const { userId } = (req as AuthRequest).user || {};
  const { projectId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const role = await getUserRole(userId, projectId);
    if (role !== "owner") {
      return res.status(403).json({ message: "Only owner can generate invite link" });
    }

    const token = jwt.sign({ projectId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    const link = `${process.env.FRONTEND_URL}/invite/${token}`;

    res.json({ inviteLink: link });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate invite link", detail: err.message });
  }
}

// Accept invite
export async function acceptInvite(req: Request, res: Response) {
  const { userId } = (req as AuthRequest).user || {};
  const { token } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { projectId: string };
    const projectId = decoded.projectId;

    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (existing) {
      return res.status(200).json({ message: "Already a member of the project" });
    }

    const member = await prisma.projectMember.create({
      data: { userId, projectId, role: "viewer" },
    });

    res.status(201).json(member);
  } catch (err: any) {
    res.status(500).json({ error: "Invalid or expired invite link", detail: err.message });
  }
}

// List members
export async function listMembers(req: Request, res: Response) {
  const { userId } = (req as AuthRequest).user || {};
  const { projectId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const role = await getUserRole(userId, projectId);
    if (!role) {
      return res.status(403).json({ error: "Not authorized to view members" });
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, email: true, username: true } } },
    });

    res.json(members);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list members", detail: err.message });
  }
}

// Update member role
export async function updateMemberRole(req: Request, res: Response) {
  const { userId } = (req as AuthRequest).user || {};
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const currentRole = await getUserRole(userId, projectId);
    if (currentRole !== "owner") {
      return res.status(403).json({ message: "Only owner can update member roles" });
    }

    const updated = await prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update member role", detail: err.message });
  }
}

// Remove member (with self-check)
export async function removeMember(req: Request, res: Response) {
  const { userId } = (req as AuthRequest).user || {};
  const { projectId, memberId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const currentRole = await getUserRole(userId, projectId);
    if (currentRole !== "owner") {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    const member = await prisma.projectMember.findUnique({ where: { id: memberId } });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.userId === userId) {
      return res.status(400).json({ message: "Owner cannot remove themselves" });
    }

    await prisma.projectMember.delete({ where: { id: memberId } });
    res.json({ message: "Member removed" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to remove member", detail: err.message });
  }
}
