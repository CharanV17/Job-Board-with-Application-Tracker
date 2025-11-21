import { api } from "./api";

export const applicationService = {
  // 1. Candidate: Apply to a job
  apply: async (data: any) => {
    const res = await api.post("/applications", data);
    return res.data;
  },

  // 2. Candidate: Get my applications
  getMyApplications: async () => {
    const res = await api.get("/applications");
    return res.data;
  },

  // 3. Get one application (Employer or Candidate)
  getApplicationById: async (id: string) => {
    const res = await api.get(`/applications/${id}`);
    return res.data;
  },

  // 4. Update application status (Employer or Kanban drag-drop)
  updateStatus: async (appId: string, status: string) => {
    const res = await api.put(`/applications/${appId}/status`, { status });
    return res.data;
  },
};
