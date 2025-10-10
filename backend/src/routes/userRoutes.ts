import { Router } from "express";
import prisma from "../lib/prisma";
import { isAuthenticated, AuthRequest } from "../middleware/authGuard";

const router = Router();

/**
 * Get the currently logged-in user's profile
 */
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const { userId } = (req as AuthRequest).user!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch profile", detail: err.message });
  }
});

/**
 * Update profile (username for now, can extend later)
 */
router.put("/me", isAuthenticated, async (req, res) => {
  try {
    const { userId } = (req as AuthRequest).user!;
    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { username },
      select: { id: true, username: true, email: true },
    });

    res.json({ message: "Profile updated", user: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update profile", detail: err.message });
  }
});

export default router;
