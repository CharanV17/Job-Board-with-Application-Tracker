// frontend/src/types/job.ts
export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  salaryMin: number;
  salaryMax: number;
  description?: string;
}
