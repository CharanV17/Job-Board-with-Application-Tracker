import Application from "../models/application.model";
import Job from "../models/job.model";
import { emailService } from "../services/email.service";
import User from "../models/user.model";
import { allowedTransitions } from "../constants/statusWorkflow";
import { Request, Response } from "express";

// =============================
// CREATE APPLICATION (Candidate)
// =============================
export const createApplication = async (req: any, res: Response) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) return res.status(400).json({ message: "Job ID required" });
    if (!req.file?.location) return res.status(400).json({ message: "Resume missing" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidateId = req.user.id;

    // Prevent duplicate submissions
    const existing = await Application.findOne({ job: jobId, candidate: candidateId });
    if (existing) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      resumeUrl: req.file.location,      // 🟢 URL returned by S3
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      coverLetter,
      status: "Applied",
      statusHistory: [
        {
          status: "Applied",
          changedBy: candidateId,
          at: new Date(),
        },
      ],
    });

    return res.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// GET APPLICATIONS OF LOGGED-IN CANDIDATE
// =============================
export const getMyApplications = async (req: any, res: Response) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.find({ candidate: candidateId })
      .populate("job", "title location salaryMin salaryMax")
      .sort({ createdAt: -1 });

    return res.json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load applications" });
  }
};

// =============================
// GET SINGLE APPLICATION
// =============================
export const getApplicationById = async (req: any, res: Response) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate", "name email");

    if (!app) return res.status(404).json({ message: "Application not found" });

    if (req.user.role === "candidate" && app.candidate._id.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    if (req.user.role === "employer") {
      const job = await Job.findById(app.job._id);
      if (!job || job.employer.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE APPLICATION STATUS (Employer only)
// =============================
export const updateStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Not found" });

    const allowed = allowedTransitions[app.status] || [];
    if (!allowed.includes(status))
      return res.status(400).json({ message: `Invalid transition` });

    app.statusHistory.push({
      status: app.status,
      changedBy: req.user.id,
      at: new Date(),
    });

    app.status = status;
    await app.save();
    return res.json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = updateStatus;
