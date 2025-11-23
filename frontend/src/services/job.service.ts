import axios from "axios";

const BASE_URL = "http://localhost:4000/api/jobs";

export const jobService = {
  async getJobs(params: any = {}) {
    try {
      const res = await axios.get(BASE_URL, { params });
      return res.data;
    } catch (err) {
      console.error("Job fetch failed:", err);
      return { jobs: [], page: 1, pages: 1, total: 0 };
    }
  },

  async getJobById(id: string) {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data.job || res.data;
  },

  async createJob(data: any, token: string) {
    const res = await axios.post(BASE_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async updateJob(id: string, data: any, token: string) {
    const res = await axios.put(`${BASE_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async getEmployerJobs(token: string) {
    const res = await axios.get(`${BASE_URL}/employer/my-jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async deleteJob(id: string, token: string) {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },async getJobApplications(jobId: string, token: string) {
  const res = await axios.get(`http://localhost:4000/api/applications/job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
},

async updateApplicationStatus(id: string, status: string, token: string) {
  const res = await axios.put(
    `http://localhost:4000/api/applications/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
},

async apply(jobId: string, token: string) {
  const res = await axios.post(
    "http://localhost:4000/api/applications",
    { jobId },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
}

};
