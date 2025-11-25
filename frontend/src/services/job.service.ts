import { api } from "./api";

export const jobService = {
  // 🔍 Public — list jobs with filters & pagination
  getJobs: async (params: any) =>
    api.get("/jobs", { params }).then((r) => r.data),

  // 🔍 Public — get job details
  getJobById: async (id: string) =>
    api.get(`/jobs/${id}`).then((r) => r.data),

  // 🧑‍💼 Employer — fetch jobs created by the logged-in employer
  getEmployerJobs: async () =>
    api.get("/employer/jobs").then((r) => r.data),

  // 🧑‍💼 Employer — create job
  createJob: async (data: any) =>
    api.post("/jobs", data).then((r) => r.data),

  // 🧑‍💼 Employer — update job
  updateJob: async (id: string, data: any) =>
    api.put(`/jobs/${id}`, data).then((r) => r.data),

  // 🧑‍💼 Employer — delete job
  deleteJob: async (id: string) =>
    api.delete(`/jobs/${id}`).then((r) => r.data),

  // 🧑‍💼 Employer — view applications for a specific job
  getJobApplications: async (jobId: string) =>
    api.get(`/employer/jobs/${jobId}/applications`).then((r) => r.data),
};
