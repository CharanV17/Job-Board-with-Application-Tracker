import { Request, Response } from "express";
import Job from "../models/job.model";
import Application from "../models/application.model";

// ---------------- CREATE JOB ----------------
export const createJob = async (req: Request & { user?: any }, res: Response) => {
  const { title, description, location, salaryMin, salaryMax, tags, remote } = req.body;

  const job = await Job.create({
    employer: req.user.id,
    title,
    description,
    location,
    salaryMin,
    salaryMax,
    tags,
    remote,
  });

  res.status(201).json(job);
};

// ---------------------------------------------------------
// JOB LIST WITH PAGINATION + SEARCH + SORT
// ---------------------------------------------------------
export const listJobs = async (req: Request, res: Response) => {
  const {
    q,
    location,
    remote,
    page = 1,
    limit = 10,
    sort = "date",
  } = req.query;

  const filter: any = {};

  if (q) filter.$text = { $search: q };
  if (location) filter.location = location;
  if (remote !== undefined) filter.remote = remote === "true";

  const sortMap: Record<string, any> = {
    date: { createdAt: -1 },
    salary: { salaryMax: -1 },
    relevance: { score: { $meta: "textScore" } },
  };

  const sortOption = sortMap[sort as string] || sortMap.date;

  const total = await Job.countDocuments(filter);

  const jobs = await Job.find(filter)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort(sortOption)
    .select(sort === "relevance" ? { score: { $meta: "textScore" } } : {});

  return res.json({
    jobs,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / +limit),
  });
};

// ---------------- GET JOB DETAILS (with hasApplied flag) ----------------
export const getJob = async (req: Request & { user?: any }, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  let hasApplied = false;

  // Only check application status if user logged in as a candidate
  if (req.user?.id && req.user?.role === "candidate") {
    const exists = await Application.exists({
      job: job._id,
      candidate: req.user.id,
    });
    hasApplied = Boolean(exists);
  }

  return res.json({
    ...job.toObject(),
    hasApplied, // 👈 consumed by frontend for Apply button logic
  });
};

// ---------------- UPDATE JOB ----------------
export const updateJob = async (
  req: Request & { user?: any },
  res: Response
) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user.id });

  if (!job) return res.status(404).json({ message: "Job not found or not yours" });

  Object.assign(job, req.body);
  await job.save();

  res.json(job);
};

// ---------------- DELETE JOB ----------------
export const deleteJob = async (
  req: Request & { user?: any },
  res: Response
) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user.id });

  if (!job) return res.status(404).json({ message: "Job not found or not yours" });

  await job.deleteOne();
  res.json({ message: "Job deleted" });
};

// ---------------- JOBS FOR EMPLOYER ----------------
export const getEmployerJobs = async (
  req: Request & { user?: any },
  res: Response
) => {
  const jobs = await Job.find({ employer: req.user.id });

  // Optionally include applicant count in the response
  const jobsWithCounts = await Promise.all(
    jobs.map(async (job: any) => {
      const count = await Application.countDocuments({ job: job._id });
      return { ...job.toObject(), applicantCount: count };
    })
  );

  res.json(jobsWithCounts);
};

// ---------------- APPLICATIONS FOR JOB ----------------
export const getJobApplications = async (
  req: Request & { user?: any },
  res: Response
) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user.id });

  if (!job) return res.status(403).json({ message: "Not allowed" });

  const applications = await Application.find({ job: job._id }).populate(
    "candidate",
    "name email"
  );

  res.json(applications);
};
