import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationService } from "../../services/application.service";
import { useAuthStore } from "../../store/auth";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getApplicationById(id!);
      setApp(data);
    } catch (err) {
      console.error(err);
      alert("Application not found");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      await applicationService.updateStatus(app._id, newStatus);
      alert("Status updated!");
      fetchApplication(); // Refresh
    } catch (err: any) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!app) return null;

  const job = app.job;
  const isEmployer = user?.role === "employer";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Application Details</h1>

      {/* Job Info */}
      <div className="bg-white shadow rounded p-5 mb-6">
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <p className="text-gray-600">{job.location}</p>
        <p className="text-gray-500 mt-2">
          Salary: ₹{job.salaryMin} - ₹{job.salaryMax}
        </p>
      </div>

      {/* Resume + Cover Letter */}
      <div className="bg-white shadow rounded p-5 mb-6">
        <h3 className="text-lg font-semibold mb-2">Resume</h3>
        <a
          href={app.resumeUrl}
          target="_blank"
          className="text-blue-600 underline"
        >
          View Resume (PDF)
        </a>

        {app.coverLetter && (
          <>
            <h3 className="text-lg font-semibold mt-4 mb-2">Cover Letter</h3>
            <p className="text-gray-700 whitespace-pre-line">{app.coverLetter}</p>
          </>
        )}
      </div>

      {/* Status */}
      <div className="bg-white shadow rounded p-5 mb-6">
        <h3 className="text-lg font-semibold mb-3">Current Status</h3>
        <p className="inline-block px-3 py-1 bg-gray-200 rounded text-sm">
          {app.status}
        </p>

        {/* Employer can update status */}
        {isEmployer && (
          <div className="mt-5">
            <label className="block mb-2 text-sm">Update Status</label>
            <select
              className="border p-2 rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={handleStatusUpdate}
              className="ml-3 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* Status History */}
      <div className="bg-white shadow rounded p-5">
        <h3 className="text-lg font-semibold mb-3">Status History</h3>

        {app.statusHistory.length === 0 && (
          <p className="text-gray-500">No status changes yet.</p>
        )}

        {app.statusHistory.map((h: any, index: number) => (
          <div key={index} className="border-b py-2">
            <p className="font-medium">{h.status}</p>
            <p className="text-gray-500 text-sm">
              {new Date(h.at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

