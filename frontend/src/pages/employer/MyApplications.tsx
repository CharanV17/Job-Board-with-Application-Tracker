import { useEffect, useState } from "react";
import { applicationService } from "../../services/application.service";

interface Application {
  _id: string;
  status: string;
  resumeUrl: string;
  coverLetter: string;
  createdAt: string;
  job: {
    title: string;
    company: string;
  };
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading applications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">You have not applied to any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{app.job.title}</h2>
                <p className="text-gray-600">{app.job.company}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>

                {app.coverLetter && (
                  <p className="mt-2 text-gray-700">
                    <strong>Cover Letter:</strong> {app.coverLetter}
                  </p>
                )}

                <a
                  href={app.resumeUrl}
                  target="_blank"
                  className="text-blue-600 underline mt-2 block"
                >
                  View Resume (PDF)
                </a>
              </div>

              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
