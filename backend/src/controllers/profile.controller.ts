import { Request, Response } from "express";
import User from "../models/user.model";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId || (req as any).user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId; // FIX

    const updates = {
      name: req.body.name,
      location: req.body.location,
      bio: req.body.bio,
      skills: req.body.skills, // already an array from frontend
      resumeUrl: req.body.resumeUrl,
    };

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Failed to update profile" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
