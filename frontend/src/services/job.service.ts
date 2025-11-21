import { api } from "./api";

export const jobService = {
  getJobs: async (params: any) => {
    const res = await api.get("/jobs", { params });
    return res.data;
  },

  getJobById: async (id: string) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  }
};

