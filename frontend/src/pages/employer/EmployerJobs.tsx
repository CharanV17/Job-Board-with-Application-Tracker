import { useEffect, useState } from "react";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  createdAt?: string;
}

export default function EmployerJobs() {
  const token = useAuthStore((s: any) => s.token);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getEmployerJobs(token);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to load employer jobs", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================
  // DELETE JOB
  // ==========================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await jobService.deleteJob(id, token);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert("Failed to delete job");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading your jobs...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posted Jobs</h1>

      </div>

      {jobs.length === 0 ? (
        <div className="text-gray-600">
          You haven’t posted any jobs yet.{" "}
          <Link to="/employer/jobs/new" className="text-blue-600 underline">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500 text-sm">
                  {job.location}
                  {job.isRemote && (
                    <span className="ml-1 text-green-600 font-medium">
                      • Remote
                    </span>
                  )}
                </p>

                {(job.salaryMin || job.salaryMax) && (
                  <p className="text-blue-600 font-semibold text-sm mt-2">
                    ₹{job.salaryMin || "—"} - ₹{job.salaryMax || "—"}
                  </p>
                )}

                {job.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                {/* EDIT JOB */}
                <button
                  onClick={() =>
                    navigate(`/employer/jobs/${job._id}/edit`)
                  }
                  className="flex-1 border rounded py-1 text-sm hover:bg-gray-50"
                >
                  Edit
                </button>

                {/* DELETE JOB */}
                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex-1 border rounded py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>

                {/* VIEW APPLICATIONS */}
                <button
                  onClick={() =>
                    navigate(`/employer/jobs/${job._id}/applications`)
                  }
                  className="flex-1 border rounded py-1 text-sm hover:bg-gray-50"
                >
                  Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
