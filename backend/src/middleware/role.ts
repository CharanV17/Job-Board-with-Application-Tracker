import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const requireRole =
  (...roles: ("candidate" | "employer")[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions"
      });
    }

    next();
  };
