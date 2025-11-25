// frontend/src/types/application.ts

export interface CreateApplicationData {
  jobId: string; // The missing property!
  resumeUrl: string;
  originalFileName: string;
  fileSize: number;
  coverLetter?: string; // Optional field
} 
