import { Schema, model } from "mongoose";

const JobSchema = new Schema(
  {
    employer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    remote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    tags: [String],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JobSchema.index({ title: "text", description: "text" });

export default model("Job", JobSchema);
