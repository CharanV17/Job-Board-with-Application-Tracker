import Application from "../models/application.model";
import Job from "../models/job.model";
import { emailService } from "../services/email.service";
import User from "../models/user.model";
import { allowedTransitions } from "../constants/statusWorkflow";
import { Request, Response } from "express";

// =============================
// CREATE APPLICATION
// =============================
export const createApplication = async (req: Request, res: Response) => {
  const session = await Application.startSession();
  session.startTransaction();

  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId).session(session);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const candidateId = (req as any).user.id;

    const application = await Application.create(
      [
        {
          job: jobId,
          candidate: candidateId,
          status: "Applied",
          statusHistory: [
            {
              status: "Applied",
              changedBy: candidateId,
              at: new Date(),
            },
          ],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // EMAIL NOTIFICATION — employer
    const employer = await User.findById(job.employer);
    const candidate = await User.findById(candidateId);

    if (employer?.email) {
      await emailService.applicationReceived(
        employer.email,
        candidate?.name || "A candidate",
        job.title
      );
    }

    return res.json(application[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// GET SINGLE APPLICATION
// =============================
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

    if (user.role === "candidate") {
      if (application.candidate._id.toString() !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (user.role === "employer") {
      const job = await Job.findById(application.job._id);
      if (!job || job.employer.toString() !== user.id) {
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
// (STEP 2)
// =============================
export const updateStatus = async (
  req: Request & { body: { status: string } },
  res: Response
) => {
  const { status } = req.body;

  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });

  const currentStatus = app.status;

  // VALIDATION
  const allowed = allowedTransitions[currentStatus] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: `Invalid status transition: ${currentStatus} → ${status}`,
    });
  }

  // Save status history BEFORE update
  app.statusHistory.push({
    status: currentStatus,
    changedBy: (req as any).user.id,
    at: new Date(),
  });

  app.status = status;
  await app.save();

  // EMAIL NOTIFICATION — candidate
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
};

// Optional: Keep backward compatibility if router still uses updateApplicationStatus
export const updateApplicationStatus = updateStatus;
