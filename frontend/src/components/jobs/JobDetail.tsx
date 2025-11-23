import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
   const user = useAuthStore((s: any) => s.user);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const data = await jobService.getJobById(id!);
      setJob(data.job || data);
    } catch (err) {
      alert("Failed to load job");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!job) return <div className="py-20 text-center">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>

      <div className="text-gray-600 flex items-center gap-4 mb-4">
        <span>{job.location}</span>

        {job.isRemote && (
          <span className="px-2 py-1 bg-green-100 rounded">Remote</span>
        )}
      </div>

      <div className="text-xl font-semibold mb-6 text-blue-700">
        ₹{job.salaryMin} - ₹{job.salaryMax}
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-6">
        {Array.isArray(job.tags) &&
          job.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              {tag}
            </span>
          ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Job Description</h2>
      <p className="text-gray-700 mb-6 whitespace-pre-line">
        {job.description}
      </p>

      <h2 className="text-xl font-semibold mb-2">Requirements</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {job.requirements || "Not provided"}
      </p>

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
