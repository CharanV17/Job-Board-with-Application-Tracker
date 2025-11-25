import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { applicationService } from "../../services/application.service";
import { useAuthStore } from "../../store/auth";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const fetchJob = async () => {
    try {
      const data = await jobService.getJobById(id!);
      setJob(data);

      // Check if candidate already applied
      if (user?.role === "candidate") {
        try {
          const apps = await applicationService.getMyApplications();
          const hasApplied = apps.some((a: any) => a.job._id === id);
          setAlreadyApplied(hasApplied);
        } catch {}
      }

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [user]);

  const handleApply = () => {
    if (!token) return navigate("/login");
    if (user?.role === "employer") return alert("Employers cannot apply to jobs");
    navigate(`/apply/${id}`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-4">{job.title}</h1>
      <p className="text-gray-600 mb-4">{job.location}</p>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold text-lg mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>

        {/* Apply button visible only for candidates */}
        {user?.role === "candidate" && (
          <div className="mt-8 flex justify-end">
            {alreadyApplied ? (
              <span className="text-green-700 font-semibold text-lg">
                ✔ Already Applied
              </span>
            ) : (
              <button
                onClick={handleApply}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                Apply Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
