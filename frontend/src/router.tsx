import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import JobList from "./pages/jobs/JobList";
import JobDetail from "./pages/jobs/JobDetail";
import ApplyJob from "./pages/jobs/ApplyJob";

import CandidateDashboard from "./pages/candidate/Dashboard";
import MyApplications from "./pages/candidate/MyApplications";
import ApplicationDetail from "./pages/applications/ApplicationDetail";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobApplications from "./pages/employer/JobApplications";
import CreateJob from "./pages/employer/CreateJob";
import EditJob from "./pages/employer/EditJob";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/candidate/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public job browsing */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Apply job (Candidate only) */}
        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        {/* Candidate dashboard */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* Candidate Applications list */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute role="candidate">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Candidate & Employer can view application details */}
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />

        {/* Employer dashboard */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employer job actions */}
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
      <Route path="/" element={<Home />} />
      <Route
  path="/jobs/:id/apply"
  element={
    <ProtectedRoute role="candidate">
      <ApplyJob />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute role="candidate">
      <Profile />
    </ProtectedRoute>
  }
/>
    </BrowserRouter>
  );
}
