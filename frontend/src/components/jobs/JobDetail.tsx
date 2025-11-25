import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";

export default function JobDetail() {
  const { id } = useParams(); // ← correct param extraction
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      if (!id) return;
      const data = await jobService.getJobById(id); // ← correct API
      setJob(data);
    } catch (err) {
      console.error(err);
      setJob(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!job) return <div className="py-20 text-center">❌ Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <div className="text-gray-600 mb-2">{job.location}</div>
      {job.remote && (
        <div className="px-2 py-1 bg-green-100 text-green-700 inline-block rounded mb-3">
          Remote Friendly
        </div>
      )}

      <div className="text-xl font-semibold text-blue-700 mb-6">
        ₹{job.salaryMin} – ₹{job.salaryMax}
      </div>

      <p className="whitespace-pre-line text-gray-700 mb-6">{job.description}</p>

      <div className="mt-10">
        {user?.role === "candidate" ? (
          <button
            onClick={() => navigate(`/apply/${job._id}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Now
          </button>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login to Apply
          </Link>
        )}
      </div>
    </div>
  );
}
