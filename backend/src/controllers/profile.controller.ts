import { Request, Response } from "express";

import User from "../models/user.model";



export const getProfile = async (req: Request, res: Response) => {

  const user = await User.findById((req as any).user.id).select("-passwordHash");

  res.json(user);

};



export const updateProfile = async (req: Request, res: Response) => {

  const updates = {

    name: req.body.name,

    location: req.body.location,

    bio: req.body.bio,

    skills: req.body.skills,

    resumeUrl: req.body.resumeUrl,

  };



  const user = await User.findByIdAndUpdate(

    (req as any).user.id,

    updates,

    { new: true }

  ).select("-passwordHash");



  res.json(user);

};


