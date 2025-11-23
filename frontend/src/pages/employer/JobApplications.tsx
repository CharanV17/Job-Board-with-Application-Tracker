import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { applicationService } from "../../services/application.service";

interface Application {
  _id: string;
  status: string;
  resumeUrl: string;
  coverLetter: string;
  createdAt: string;
  candidate: {
    name: string;
    email: string;
  };
}

export default function JobApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
     const data = await applicationService.getApplicationsForJob(jobId!);

      setApplications(data.applications || []);
    } catch (err) {
      console.error("Failed to load job applications:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await applicationService.updateStatus(id, status);

      fetchApplications(); // refresh
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading applications...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Applications for this Job</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-semibold">{app.candidate.name}</h2>
                <p className="text-gray-600">{app.candidate.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>

                {/* Cover Letter */}
                {app.coverLetter && (
                  <p className="mt-2 text-gray-700">
                    <strong>Cover Letter:</strong> {app.coverLetter}
                  </p>
                )}

                {/* Resume Link */}
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  className="text-blue-600 underline mt-2 block"
                >
                  View Resume (PDF)
                </a>
              </div>

              {/* Status Controls */}
              <div className="flex flex-col gap-2 w-full md:w-40">
                <span className="text-sm font-semibold text-gray-500">
                  Status: {app.status}
                </span>

                <button
                  onClick={() => updateStatus(app._id, "Shortlisted")}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => updateStatus(app._id, "Rejected")}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Reject
                </button>

                <button
                  onClick={() => updateStatus(app._id, "Hired")}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Hire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
