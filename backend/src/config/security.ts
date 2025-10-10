// config/security.ts
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";


export function setupSecurity(app: express.Application) {
  /* ---------------------------------- */
  /* 🔒 1. SECURITY MIDDLEWARES         */
  /* ---------------------------------- */
  app.use(helmet());
  app.use(compression());

  /* ---------------------------------- */
  /* ⚡ 2. RATE LIMITING                 */
  /* ---------------------------------- */
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10,
    message: { error: "Too many requests, please try again later." },
  });
  app.use("/api/", apiLimiter);

  /* ---------------------------------- */
  /* 🌍 3. CORS CONFIGURATION            */
  /* ---------------------------------- */
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

  /* ---------------------------------- */
  /* 🍪 4. PARSERS & SESSION SETUP      */
  /* ---------------------------------- */
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );
}
