import { Router } from "express";
import { isAuthenticated } from "../middleware/authGuard";
import {
  addMember,
  generateInviteLink,
  acceptInvite,
  listMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/projectMemberController";

const router = Router();

// Add member manually (by email)
router.post("/:projectId/members", isAuthenticated, addMember);

// Generate invite link
router.post("/:projectId/members/invite", isAuthenticated, generateInviteLink);

// Accept invite
router.post("/invite/:token", isAuthenticated, acceptInvite);

// List project members
router.get("/:projectId/members", isAuthenticated, listMembers);

// Update member role
router.put("/:projectId/members/:memberId", isAuthenticated, updateMemberRole);

// Remove member
router.delete("/:projectId/members/:memberId", isAuthenticated, removeMember);

export default router;
