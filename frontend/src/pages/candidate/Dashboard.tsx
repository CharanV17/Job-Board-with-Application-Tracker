import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { applicationService } from "../../services/application.service";
import { Link } from "react-router-dom";

interface Application {
  _id: string;
  job: {
    title: string;
    company: string;
  };
  status: string;
  createdAt: string;
}

export default function CandidateDashboard() {
  const user = useAuthStore((s: any) => s.user);
  const token = useAuthStore((s: any) => s.token);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await applicationService.getMyApplications();

      setApplications(data.applications || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome, <span className="text-blue-600">{user?.name}</span>
      </h1>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-4xl font-bold">{applications.length}</h2>
          <p className="text-gray-500">Total Applications</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <Link to="/applications" className="text-blue-600 font-semibold">
            View All Applications →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <Link to="/profile" className="text-blue-600 font-semibold">
            Edit Profile →
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-700">
          You haven't applied to any jobs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {applications.slice(0, 5).map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{app.job.title}</h3>
                <p className="text-gray-600">{app.job.company}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
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
