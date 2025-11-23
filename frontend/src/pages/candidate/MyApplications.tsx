import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import axios from "axios";
import { Link } from "react-router-dom";

interface JobInfo {
  title: string;
  company: string;
  location: string;
}

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  job: JobInfo;
}

export default function MyApplications() {
  const token = useAuthStore((s: any) => s.token);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
        
      });
      setApps(res.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
    setLoading(false);
    console.log("Calling:", "/applications/my");
  };

  useEffect(() => {
    fetchApps();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading your applications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {apps.length === 0 ? (
        <p className="text-gray-600">
          You have not applied to any jobs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div
              key={app._id}
              className="p-4 bg-white rounded-lg shadow flex flex-col sm:flex-row justify-between"
            >
              {/* Left: Job Info */}
              <div>
                <h2 className="text-lg font-semibold">{app.job.title}</h2>
                <p className="text-gray-600">{app.job.company}</p>
                <p className="text-gray-500 text-sm">{app.job.location}</p>

                <p className="text-blue-600 font-semibold mt-2">
                  Status: {app.status}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Right: View Button */}
              <div className="mt-3 sm:mt-0">
                <Link
                  to={`/applications/${app._id}`}
                  className="px-4 py-2 bg-gray-100 rounded border hover:bg-gray-200 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
