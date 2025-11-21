import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 Global Error:", err);

  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
