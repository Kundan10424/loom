// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthUser {
//   userId: string;
// }

// export interface AuthRequest extends Request {
//   user?: AuthUser;
// }

// export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(401).json({
//       error: "Unauthorized, no token provided",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
//     (req as AuthRequest).user = decoded; // safe cast here
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       error: "Unauthorized, invalid or expired token",
//     });
//   }
// };


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string; // ✅ keep userId for backward compatibility
  id?: string;    // optional alias for consistency
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // ✅ Normalize decoded payload for compatibility
    const user = {
      userId: decoded.userId || decoded.id, // always available
      id: decoded.id || decoded.userId,     // both accessible
    };

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized, invalid or expired token",
    });
  }
};
