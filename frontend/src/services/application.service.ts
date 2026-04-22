import { api } from "./api";

export const applicationService = {
  async apply(data: any) {
    const token = localStorage.getItem("token");

    return api.post("/applications", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getMyApplications() {
    const token = localStorage.getItem("token");

    const res = await api.get("/applications/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  async getApplicationsForJob(jobId: string) {
    const token = localStorage.getItem("token");

    const res = await api.get(`/applications/job/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  async updateStatus(id: string, status: string) {
    const token = localStorage.getItem("token");

    const res = await api.put(
      `/applications/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },
};
