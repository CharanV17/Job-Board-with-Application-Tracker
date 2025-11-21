import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationService } from "../../services/application.service";
import { useAuthStore } from "../../store/auth";

export default function JobApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const data = await applicationService.getJobApplications(jobId!);
      setApplications(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applications");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/jobs");
      return;
    }
    fetchApps();
  }, []);

  const updateStatus = async (appId: string, status: string) => {
    try {
      await applicationService.updateStatus(appId, status);
      fetchApps();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Applications for Job</h1>

      <div className="space-y-4">
        {applications.map((app: any) => (
          <div
            key={app._id}
            className="p-5 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {app.candidate?.name || "Candidate"}
                </h2>
                <p className="text-gray-600">{app.candidate?.email}</p>

                <div className="text-sm text-gray-700 mt-2">
                  Status:
                  <span className="ml-2 font-medium bg-gray-200 px-2 py-1 rounded">
                    {app.status}
                  </span>
                </div>

                {app.coverLetter && (
                  <p className="mt-4 text-gray-700 whitespace-pre-line">
                    {app.coverLetter}
                  </p>
                )}

                <a
                  href={app.resumeUrl}
                  target="_blank"
                  className="text-blue-600 underline mt-3 inline-block"
                >
                  View Resume (PDF)
                </a>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => navigate(`/applications/${app._id}`)}
                >
                  View Details
                </button>

                {/* STATUS UPDATE */}
                <select
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="border p-2 rounded"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Update Status
                  </option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <p className="text-center text-gray-500">No applications yet.</p>
        )}
      </div>
    </div>
  );
}

