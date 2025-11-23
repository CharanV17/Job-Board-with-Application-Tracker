import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    originalFileName: String,
    fileSize: Number,
    coverLetter: String,
    status: {
      type: String,
      enum: ["Applied", "Screening", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    statusHistory: [
      {
        status: String,
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        at: Date,
      },
    ],
  },
  { timestamps: true }
);

export default model("Application", ApplicationSchema);
