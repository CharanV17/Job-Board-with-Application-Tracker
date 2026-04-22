import { Request, Response } from "express";
import Application from "../models/application.model";
import Job from "../models/job.model";
import User from "../models/user.model";
import { emailService } from "../services/email.service";
import { allowedTransitions } from "../constants/statusWorkflow";

// =============================
// CREATE APPLICATION (NO TRANSACTIONS, WORKS ON LOCAL MONGODB)
// =============================
export const createApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;   // from JWT
    const { jobId, resumeUrl, coverLetter } = req.body;

    if (!jobId || !resumeUrl) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: userId,
      resumeUrl,
      coverLetter,
      status: "Applied",
      statusHistory: [
        {
          status: "Applied",
          changedBy: userId,
          at: new Date(),
        },
      ],
    });

    return res.json({ success: true, application });
  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const appId = req.params.id;

    const application = await Application.findById(appId)
      .populate("job")
      .populate("candidate");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const user = (req as any).user;

    if (user.role === "candidate" && application.candidate._id.toString() !== user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (user.role === "employer") {
      const job = await Job.findById(application.job._id);
      if (!job || job.employerId.toString() !== user.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    return res.json(application);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE APPLICATION STATUS
// =============================
export const updateStatus = async (
  req: Request & { body: { status: string } },
  res: Response
) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const currentStatus = app.status;

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid transition: ${currentStatus} → ${status}`,
      });
    }

    app.statusHistory.push({
      status: currentStatus,
      changedBy: (req as any).user.userId,
      at: new Date(),
    });

    app.status = status;
    await app.save();

    const job = await Job.findById(app.job);
    const candidate = await User.findById(app.candidate);

    if (candidate?.email) {
      await emailService.statusUpdated(
        candidate.email,
        status,
        job?.title || "Job"
      );
    }

    return res.json(app);
  } catch (error) {
    console.error("updateStatus Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// GET APPLICATIONS FOR ONE JOB (Employer)
// =============================
export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const employerId = (req as any).user.userId;

    const job = await Job.findById(jobId);
    if (!job || job.employerId.toString() !== employerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, applications });
  } catch (err) {
    console.error("getApplicationsForJob Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// =============================
// GET MY APPLICATIONS (Candidate)
// =============================
export const getMyApplications = async (req: any, res: Response) => {
  try {
    const candidateId = req.user.userId;

    const applications = await Application.find({ candidate: candidateId })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.json({ success: true, applications });
  } catch (err) {
    console.error("getMyApplications Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateApplicationStatus = updateStatus;
