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
// IMPROVED JOB SEARCH WITH PAGINATION + SORTING + TEXT SCORE
// ---------------------------------------------------------
export const listJobs = async (req: Request, res: Response) => {
  const {
    q,
    location,
    remote,
    page = 1,
    limit = 10,
    sort = "date"
  } = req.query;

  const filter: any = {};

  if (q) filter.$text = { $search: q };
  if (location) filter.location = location;
  if (remote !== undefined) filter.remote = remote === "true";

  // Sorting map
  const sortMap: Record<string, any> = {
    date: { createdAt: -1 },
    salary: { salaryMax: -1 },
    relevance: { score: { $meta: "textScore" } },
  };

  const sortOption = sortMap[sort as string] || sortMap.date;

  // Get total count for pagination
  const total = await Job.countDocuments(filter);

  // Query jobs
  const jobs = await Job.find(filter)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort(sortOption)
    .select(sort === "relevance" ? { score: { $meta: "textScore" } } : {});

  // 🔥 Updated pagination response format (required by frontend)
  return res.json({
    jobs,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / +limit),
  });
};

// ---------------- GET JOB DETAILS ----------------
export const getJob = async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  res.json(job);
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
  res.json(jobs);
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
