import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

export const auth = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "No token" });
  const token = header.replace("Bearer ", "");
  try {
    const secret = process.env.JWT_SECRET || "changeme";
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (role: "employer" | "candidate") => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    return next();
  };
};
