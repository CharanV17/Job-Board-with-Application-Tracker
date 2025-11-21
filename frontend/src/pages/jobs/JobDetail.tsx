import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const data = await jobService.getJobById(id!);
      setJob(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const handleApply = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "employer") {
      alert("Employers cannot apply to jobs.");
      return;
    }

    navigate(`/apply/${id}`);
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center py-20">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-4">{job.title}</h1>

      <div className="text-gray-600 mb-6">
        {job.location} •{" "}
        {job.remote && (
          <span className="text-green-700 font-medium">Remote Friendly</span>
        )}
      </div>

      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>

        <div className="mt-6">
          <h3 className="font-semibold mb-1">Salary Range:</h3>
          <p className="text-gray-700">
            ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
          </p>
        </div>

        {job.tags?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-1">Skills Required:</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
