import { Request, Response } from "express";
import JobModel from "../models/job.model";

// =============================
// CREATE JOB (EMPLOYER)
// =============================
export const createJob = async (req: any, res: Response) => {
  try {
    const employerId = req.user.userId; // from authMiddleware

    const {
      title,
      company,
      description,
      location,
      isRemote,
      salaryMin,
      salaryMax,
    } = req.body;

    // Basic validation
    if (!title || !location) {
      return res.status(400).json({
        success: false,
        message: "Title and location are required",
      });
    }

    const job = await JobModel.create({
      title,
      company,
      description,
      location,
      isRemote: !!isRemote,
      salaryMin: salaryMin ?? 0,
      salaryMax: salaryMax ?? 0,
      employerId,
    });

    return res.status(201).json({
      success: true,
      job,
    });
  } catch (err) {
    console.error("createJob error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// GET JOBS (PUBLIC + FILTERS)
// =============================
export const getJobs = async (req: Request, res: Response) => {
  try {
    let {
      keyword,
      location,
      remote,
      minSalary,
      maxSalary,
      sort = "date",
      page = "1",
      limit = "10",
    } = req.query as any;

    const filters: any = {};

    // 🔍 KEYWORD SEARCH
    if (keyword) {
      const search = new RegExp(keyword, "i");
      filters.$or = [
        { title: search },
        { description: search },
        { company: search },
      ];
    }

    // 📍 LOCATION FILTER
    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    // 🏠 REMOTE / ON-SITE FILTER
    if (remote === "true") filters.isRemote = true;
    if (remote === "false") filters.isRemote = false;

    // 💰 SALARY RANGE FILTER
    if (minSalary || maxSalary) {
      filters.salaryMin = {};
      if (minSalary) filters.salaryMin.$gte = Number(minSalary);
      if (maxSalary) filters.salaryMin.$lte = Number(maxSalary);
    }

    // 🔥 SORTING OPTIONS
    let sortQuery: any = {};
    switch (sort) {
      case "date":
        sortQuery = { createdAt: -1 };
        break;
      case "relevance":
        sortQuery = { title: 1 };
        break;
      case "salaryAsc":
        sortQuery = { salaryMin: 1 };
        break;
      case "salaryDesc":
        sortQuery = { salaryMax: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    // 📄 PAGINATION
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const jobs = await JobModel.find(filters)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    const total = await JobModel.countDocuments(filters);
    const pages = Math.ceil(total / limitNum);

    return res.json({
      success: true,
      jobs,
      page: pageNum,
      pages,
      total,
    });
  } catch (err) {
    console.error("getJobs error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// EMPLOYER: MY JOBS
// =============================
export const getEmployerJobs = async (req: any, res: Response) => {
  try {
    const employerId = req.user.userId; // from authMiddleware

    const jobs = await JobModel.find({ employerId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.error("getEmployerJobs error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// UPDATE JOB
// =============================
export const updateJob = async (req: any, res: Response) => {
  try {
    const employerId = req.user.userId; // from JWT
    const jobId = req.params.id;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    // Only owner employer can edit
    if (job.employerId.toString() !== employerId) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const {
      title,
      company,
      location,
      salaryMin,
      salaryMax,
      description,
      isRemote,
    } = req.body;

    if (!title || !company || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, company and location are required",
      });
    }

    job.title = title;
    job.company = company;
    job.location = location;
    job.salaryMin = salaryMin;
    job.salaryMax = salaryMax;
    job.description = description;
    job.isRemote = isRemote;

    await job.save();

    return res.json({ success: true, job });
  } catch (err) {
    console.error("updateJob error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await JobModel.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.json({ success: true, job });
  } catch (err) {
    console.error("getJobById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
