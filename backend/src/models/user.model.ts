import { Schema, model } from "mongoose";

export type Role = "employer" | "candidate";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["employer","candidate"], required: true },
  profile: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default model("User", UserSchema);
