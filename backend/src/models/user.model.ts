import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employer";
  location?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["candidate", "employer"],
      required: true,
    },

    // NEW PROFILE FIELDS
    location: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
