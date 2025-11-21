import { api } from "./api";

export const applicationService = {
  apply: async (data: any) => {
    const res = await api.post("/applications", data);
    return res.data;
  },

  getMyApplications: async () => {
    const res = await api.get("/applications");
    return res.data;
  },

  getApplicationById: async (id: string) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  updateStatus: async (appId: string, status: string) => {
    const res = await api.put(`/applications/${appId}/status`, { status });
    return res.data;
  },

  getJobApplications: async (jobId: string) => {
    const res = await api.get(`/jobs/${jobId}/applications`);
    return res.data;
  }
};
