import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// --- Helper functions ---
function generateAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function generateRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

// --- Controllers ---

// ✅ Signup Controller
export async function signup(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user exists by email or username
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return res.status(409).json({ error: "User already exists with this email or username" });
    }

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    const accessToken = generateAccessToken({ id: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id });

    return res
      .cookie("token", refreshToken, COOKIE_OPTIONS)
      .status(201)
      .json({
        message: "Signup successful",
        accessToken,
        user: { id: user.id, email: user.email, username: user.username },
      });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed", detail: err.message });
  }
}

// ✅ Login Controller
export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.password) {
      // This happens if the user signed up with Google or GitHub
      return res.status(400).json({ error: "This account uses OAuth login. Please sign in with Google or GitHub." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id });

    return res
      .cookie("token", refreshToken, COOKIE_OPTIONS)
      .json({
        message: "Login successful",
        accessToken,
        user: { id: user.id, email: user.email, username: user.username },
      });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed", detail: err.message });
  }
}

// ✅ Logout Controller
export async function logout(_req: Request, res: Response) {
  return res.clearCookie("token", COOKIE_OPTIONS).json({ message: "Logged out successfully" });
}
