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
import CreateJob from "./pages/employer/CreateJob";
import EditJob from "./pages/employer/EditJob";

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Jobs (Public View) */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Apply Job (Candidate Only) */}
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        {/* Candidate Dashboard */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* Application Detail (Candidate + Employer) */}
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />

        {/* Employer Dashboard */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employer Job Actions */}
        <Route
          path="/employer/jobs/create"
          element={
            <ProtectedRoute role="employer">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs/:jobId/edit"
          element={
            <ProtectedRoute role="employer">
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs/:jobId/applications"
          element={
            <ProtectedRoute role="employer">
              <JobApplications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
