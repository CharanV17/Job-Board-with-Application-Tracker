import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/auth";

export default function ApplicationDetail() {
  const { id } = useParams();
  const token = useAuthStore((s: any) => s.token);

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplication(res.data);
    } catch (err) {
      console.error("Failed to fetch application details:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!application) return <div className="p-6 text-center">Application not found</div>;

  const job = application.job;
  const history = application.statusHistory || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/applications" className="text-blue-600 underline text-sm">
        ← Back to My Applications
      </Link>

      {/* Job Title */}
      <h1 className="text-3xl font-bold mt-4">{job.title}</h1>

      <p className="text-gray-700">{job.company}</p>
      <p className="text-gray-600 text-sm">{job.location}</p>
      {job.isRemote && (
        <p className="text-green-600 text-sm font-semibold mt-1">Remote</p>
      )}

      {/* Status */}
      <div className="mt-4">
        <span className="font-semibold">Current Status:</span>{" "}
        <span className="px-2 py-1 bg-blue-100 rounded">
          {application.status}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Status History</h2>
        <div className="mt-3 space-y-3">
          {history.map((item: any, index: number) => (
            <div
              key={index}
              className="p-3 border rounded bg-gray-50 flex justify-between"
            >
              <div>
                <p className="font-semibold">{item.status}</p>
                <p className="text-xs text-gray-500">
                  Updated by: {item.changedBy === application.candidate._id ? "You" : "Employer"}
                </p>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(item.at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
      </div>

      {/* Requirements */}
      {job.requirements && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
        </div>
      )}
    </div>
  );
}
