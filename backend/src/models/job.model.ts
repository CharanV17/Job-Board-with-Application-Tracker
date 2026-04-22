import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company?: string;
  description?: string;
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: Date;
  employerId: mongoose.Types.ObjectId | string;
  applicantsCount?: number;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String },
    description: { type: String },
    location: { type: String },
    isRemote: { type: Boolean, default: false },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create text index for keyword search (title + description)
JobSchema.index({ title: "text", description: "text" });

export default mongoose.model<IJob>("Job", JobSchema);
