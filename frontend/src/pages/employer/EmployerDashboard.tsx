import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function EmployerDashboard() {
  const user = useAuthStore((s: any) => s.user);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.name} 👋
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Post Job */}
        <Link
          to="/employer/jobs/new"
          className="p-6 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <h2 className="text-xl font-semibold">Post New Job</h2>
          <p className="text-sm mt-2">Create and publish a new job listing.</p>
        </Link>

        {/* Manage Jobs */}
        <Link
          to="/employer/jobs"
          className="p-6 bg-white border rounded-xl shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-800">Manage Jobs</h2>
          <p className="text-sm text-gray-500 mt-2">
            Edit or delete your posted jobs.
          </p>
        </Link>

        {/* Applications */}
        <Link
          to="/employer/applications"
          className="p-6 bg-white border rounded-xl shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            View Applications
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Track job applications and update status.
          </p>
        </Link>

      </div>
    </div>
  );
}
