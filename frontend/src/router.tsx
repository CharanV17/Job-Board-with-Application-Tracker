 import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import JobList from "./pages/jobs/JobList";
import JobDetail from "./pages/jobs/JobDetail";
import ApplyJob from "./pages/jobs/ApplyJob";
import CandidateDashboard from "./pages/candidate/Dashboard";
import ApplicationDetail from "./pages/applications/ApplicationDetail";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobApplications from "./pages/employer/JobApplications";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Jobs */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route
  path="/employer/jobs/:jobId/applications"
  element={<JobApplications />}
/>

      </Routes>
    </BrowserRouter>
  );
}
