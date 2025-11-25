import { useEffect, useState } from "react";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const loadingAuth = useAuthStore((s) => s.loading);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getEmployerJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setJobs([]); // ensures UI does not break
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loadingAuth && user?.role === "employer") fetchJobs();
  }, [loadingAuth, user]);

  if (loadingAuth || loadingData)
    return <div className="text-center py-20">Loading...</div>;

  // EMPTY STATE FIX — show Create Job button even with no jobs
  if (jobs.length === 0)
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Employer Dashboard</h1>

          <button
            onClick={() => navigate("/employer/jobs/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            + Create Job
          </button>
        </div>

        <EmptyState
          title="No job postings yet"
          message="Create your first job to start receiving applications."
        />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Employer Dashboard</h1>

        <button
          onClick={() => navigate("/employer/jobs/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Create Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job: any) => (
          <div
            key={job._id}
            className="p-5 bg-white rounded shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.location}</p>

            <div className="mt-3 text-sm text-gray-700">
              Applicants:
              <span className="ml-2 font-medium">{job.applicantCount}</span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => navigate(`/employer/jobs/${job._id}/edit`)}
              >
                Edit
              </button>

              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => navigate(`/employer/jobs/${job._id}/applications`)}
              >
                View Applications
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
