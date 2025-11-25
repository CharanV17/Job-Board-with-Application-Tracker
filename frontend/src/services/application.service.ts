import { api } from "./api";
// import { CreateApplicationData } from "../types/application"; // 💡 Removed, as we'll define the required interface for clarity

// 1. Define the interface for the specific data being submitted from ApplyJob.tsx
interface CreateApplicationData {
  jobId: string | undefined;
  resumeUrl: string;
  originalFileName: string;
  fileSize: number;
  coverLetter: string;
}

export const applicationService = {
  // Candidate → Apply to job (Use the specific data interface instead of generic FormData)
  apply: async (data: CreateApplicationData) =>
    // Axios sends a JSON payload by default when using an object, which is what the backend expects
    api.post("/applications", data).then((r) => r.data),

  // Candidate → Get my applications for dashboard
  getMyApplications: async () =>
    api.get("/applications/my").then((r) => r.data),

  // Candidate + Employer → View single application
  getApplicationById: async (id: string) =>
    api.get(`/applications/${id}`).then((r) => r.data),

  // Employer → Update application workflow status
  updateStatus: async (appId: string, status: string) =>
    api.put(`/applications/${appId}/status`, { status }).then((r) => r.data),

  // Employer → Get applications for a job posted by employer
  getJobApplications: async (jobId: string) =>
    api.get(`/employer/jobs/${jobId}/applications`).then((r) => r.data),

  
};