import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CandidateKanban from "./pages/candidate/CandidateKanban";
import JobList from "./pages/jobs/JobList";
import JobDetail from "./pages/jobs/JobDetail";
import ApplyJob from "./pages/jobs/ApplyJob";

import CandidateDashboard from "./pages/candidate/Dashboard";
import MyApplications from "./pages/candidate/MyApplications";
import ApplicationDetail from "./pages/applications/ApplicationDetail";
import Profile from "./pages/candidate/Profile";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerJobs from "./pages/employer/EmployerJobs";
import PostJob from "./pages/employer/PostJob";
import EditJob from "./pages/employer/EditJob";
import JobApplications from "./pages/employer/JobApplications";

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PUBLIC JOB BROWSING */}
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetail />} />

      {/* APPLY TO JOB — CANDIDATE ONLY */}
      <Route
        path="/apply/:id"
        element={
          <ProtectedRoute role="candidate">
            <ApplyJob />
          </ProtectedRoute>
        }
      />
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute role="candidate">
      <CandidateKanban />
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

      {/* ------------------------------ */}
      {/* CANDIDATE ROUTES */}
      {/* ------------------------------ */}

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute role="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute role="candidate">
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications/:id"
        element={
          <ProtectedRoute role="candidate">
            <ApplicationDetail />
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

      {/* ------------------------------ */}
      {/* EMPLOYER ROUTES */}
      {/* ------------------------------ */}

      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute role="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/jobs"
        element={
          <ProtectedRoute role="employer">
            <EmployerJobs />
          </ProtectedRoute>
        }
      />

      {/* POST NEW JOB */}
      <Route
        path="/employer/jobs/new"
        element={
          <ProtectedRoute role="employer">
            <PostJob />
          </ProtectedRoute>
        }
      />

      {/* EDIT JOB */}
      <Route
        path="/employer/jobs/:jobId/edit"
        element={
          <ProtectedRoute role="employer">
            <EditJob />
          </ProtectedRoute>
        }
      />

      {/* SEE APPLICATIONS FOR A JOB */}
      <Route
        path="/employer/jobs/:jobId/applications"
        element={
          <ProtectedRoute role="employer">
            <JobApplications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
