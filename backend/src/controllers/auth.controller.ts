import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "Missing fields" });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash: hash,
    role,
  });

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES as string }
  );

  return res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    token,
  });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES as string }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
};

// ME
export const me = async (req: Request, res: Response) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    const user = await User.findById(payload.id).select("-passwordHash");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
