import { api } from "../../services/api";
// 💡 FIX: Import AxiosResponse for explicit typing of the response object
import { type AxiosResponse } from "axios";

// NOTE: We do NOT need the CreateApplicationData interface here 
// because we are using the native FormData type.

export const applicationService = {
  // Candidate → Apply to job
  apply: async (formData: FormData) =>
    // FIX APPLIED: Type 'r' as AxiosResponse to resolve ts(7006)
    api.post("/applications", formData).then((r: AxiosResponse) => r.data),

  // Candidate → Get my applications for dashboard
  getMyApplications: async () =>
    // FIX APPLIED: Type 'r' as AxiosResponse
    api.get("/applications/my").then((r: AxiosResponse) => r.data),

  // Candidate + Employer → View single application
  getApplicationById: async (id: string) =>
    // FIX APPLIED: Type 'r' as AxiosResponse
    api.get(`/applications/${id}`).then((r: AxiosResponse) => r.data),

  // Employer → Update application workflow status
  updateStatus: async (appId: string, status: string) =>
    // FIX APPLIED: Type 'r' as AxiosResponse
    api.put(`/applications/${appId}/status`, { status }).then((r: AxiosResponse) => r.data),

  // Employer → Get applications for a job posted by employer
  getJobApplications: async (jobId: string) =>
    // FIX APPLIED: Type 'r' as AxiosResponse
    api.get(`/employer/jobs/${jobId}/applications`).then((r: AxiosResponse) => r.data),
};