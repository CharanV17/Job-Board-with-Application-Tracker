import { api } from "./api";

export const jobService = {
  getJobs: async (params: any) => api.get("/jobs", { params }).then(r => r.data),

  getJobById: async (id: string) => api.get(`/jobs/${id}`).then(r => r.data),

  getEmployerJobs: async () => api.get("/employer/jobs").then(r => r.data),

  createJob: async (data: any) => api.post("/jobs", data).then(r => r.data),

  updateJob: async (id: string, data: any) =>
    api.put(`/jobs/${id}`, data).then(r => r.data)
};
