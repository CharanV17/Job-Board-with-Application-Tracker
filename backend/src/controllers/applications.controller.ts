import { Request, Response } from "express";
import mongoose from "mongoose";

import Application from "../models/application.model";
import Job from "../models/job.model";
import User from "../models/user.model";

import { sendEmail } from "../services/email.service";
import { applicationReceivedTemplate } from "../emails/application-received";
import { applicationStatusUpdateTemplate } from "../emails/application-status-update";

// ---------------- APPLY TO JOB ----------------
export const createApplication = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { jobId, resumeUrl, originalFileName, fileSize, coverLetter } = req.body;

  // 1. Check job exists
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // 1b. Ensure candidate exists (needed for notifications)
  const candidate = await User.findById(req.user.id).select("name email");
  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  // 2. Check if candidate already applied
  const exists = await Application.findOne({
    job: jobId,
    candidate: req.user.id,
  });

  if (exists) {
    return res.status(400).json({ message: "Already applied to this job" });
  }

  // 3. Transaction: Create application + increment applicantCount
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const app = await Application.create(
      [
        {
          job: jobId,
          candidate: req.user.id,
          resumeUrl,
          originalFileName,
          fileSize,
          coverLetter,
        },
      ],
      { session }
    );

    await Job.findByIdAndUpdate(
      jobId,
      { $inc: { applicantCount: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // ---------------- EMAIL EMPLOYER ----------------
    const employer = await User.findById(job.employer);

    if (employer?.email) {
      await sendEmail(
        employer.email,
        "New Job Application Received",
        applicationReceivedTemplate(candidate.name ?? "A candidate", job.title)
      );
    }

    return res.status(201).json(app[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ---------------- GET ALL MY APPLICATIONS (Candidate) ----------------
export const getMyApplications = async (
  req: Request & { user?: any },
  res: Response
) => {
  const docs = await Application.find({ candidate: req.user.id })
    .populate("job")
    .sort("-createdAt");

  res.json(docs);
};

// ---------------- WITHDRAW APPLICATION (Candidate) ----------------
export const withdrawApplication = async (
  req: Request & { user?: any },
  res: Response
) => {
  const app = await Application.findById(req.params.id);

  if (!app) return res.status(404).json({ message: "Application not found" });

  if (String(app.candidate) !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  // Mark as rejected (or "Withdrawn" if you add that status later)
  app.status = "Rejected";
  await app.save();

  res.json({ message: "Application withdrawn" });
};

// ---------------- UPDATE APPLICATION STATUS (Employer) ----------------
export const updateStatus = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { status } = req.body;

  // 1. Get application with populated job
  const app = await Application.findById(req.params.id).populate("job");
  if (!app) return res.status(404).json({ message: "Application not found" });

  // 2. Only the employer who owns this job can update status
  if (String((app.job as any).employer) !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // 3. Maintain status history
  app.statusHistory = app.statusHistory || [];
  app.statusHistory.push({
    status: app.status,
    changedBy: req.user.id,
    at: new Date(),
  });

  // 4. Update status
  app.status = status;
  await app.save();

  // ---------------- EMAIL CANDIDATE ----------------
  const candidate = await User.findById(app.candidate);

  if (candidate?.email) {
    await sendEmail(
      candidate.email,
      "Application Status Updated",
      applicationStatusUpdateTemplate(
        candidate.name,
        status,
        (app.job as any).title
      )
    );
  }

  res.json(app);
};
