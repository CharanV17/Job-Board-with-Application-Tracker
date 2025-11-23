import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((s: any) => s.token);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    isRemote: false,
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const data = await jobService.getJobById(jobId!);
      setForm({
        title: data.title,
        company: data.company,
        location: data.location,
        isRemote: data.isRemote,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        description: data.description,
        requirements: data.requirements,
      });
    } catch (err) {
      console.error("Error loading job:", err);
      alert("Failed to load job");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await jobService.updateJob(jobId!, form, token);
      alert("Job updated successfully!");
      navigate("/employer/jobs");
    } catch (err) {
      console.error("Update Failed:", err);
      alert("Failed to update job");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        
        {/* Title */}
        <div>
          <label className="block font-semibold">Job Title</label>
          <input
            className="w-full border p-2 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className="block font-semibold">Company</label>
          <input
            className="w-full border p-2 rounded"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold">Location</label>
          <input
            className="w-full border p-2 rounded"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>

        {/* Remote */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isRemote}
            onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
          />
          <label>Remote Job</label>
        </div>

        {/* Salary */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Minimum Salary</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold">Maximum Salary</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Job Description</label>
          <textarea
            className="w-full border p-2 rounded min-h-[120px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>
        </div>

        {/* Requirements */}
        <div>
          <label className="block font-semibold">Requirements</label>
          <textarea
            className="w-full border p-2 rounded min-h-[100px]"
            value={form.requirements}
            onChange={(e) =>
              setForm({ ...form, requirements: e.target.value })
            }
          ></textarea>
        </div>

        <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Job
        </button>
      </form>
    </div>
  );
}
