import { useEffect, useState } from "react";
import { applicationService } from "../../services/application.service";
import { Link } from "react-router-dom";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApps(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load applications");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">My Applications</h1>

      <div className="space-y-4">
        {apps.map((app: any) => (
          <div
            key={app._id}
            className="p-5 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                {/* Job Info */}
                <h2 className="text-xl font-semibold">{app.job.title}</h2>
                <p className="text-gray-600">{app.job.location}</p>

                <div className="text-sm mt-2 text-gray-700">
                  Applied on:
                  <span className="ml-1 font-medium">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Status */}
                <div className="mt-2">
                  <span className="px-3 py-1 rounded bg-gray-200 text-sm font-medium">
                    {app.status}
                  </span>
                </div>

                {/* Resume */}
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  className="text-blue-600 underline mt-3 inline-block"
                >
                  View Resume
                </a>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-3">
                <Link
                  to={`/applications/${app._id}`}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  View Details
                </Link>

                {/* Withdraw Button */}
                {app.status === "Applied" && (
                  <button
                    onClick={() => alert("Withdraw feature coming soon")}
                    className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-700 rounded text-sm"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {apps.length === 0 && (
          <p className="text-center text-gray-500">No applications found.</p>
        )}
      </div>
    </div>
  );
}
 
