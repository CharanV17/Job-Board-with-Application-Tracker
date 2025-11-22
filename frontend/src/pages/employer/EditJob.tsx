import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    remote: false,
    salaryMin: "",
    salaryMax: "",
    tags: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect unauthorized users
  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/jobs");
    }
  }, []);

  const fetchJob = async () => {
    try {
      const job = await jobService.getJobById(jobId!);

      setForm({
        title: job.title,
        description: job.description,
        location: job.location,
        remote: job.remote,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        tags: job.tags?.join(", ") || ""
      });

      setLoading(false);
    } catch (err) {
      alert("Failed to load job");
      navigate("/employer/dashboard");
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const handleChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      await jobService.updateJob(jobId!, {
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      });

      alert("Job updated successfully!");
      navigate("/employer/dashboard");

    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update job");
    }

    setSaving(false);
  };

  if (loading)
    return <div className="text-center py-20">Loading job details...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Edit Job</h1>

      <form className="space-y-5 bg-white shadow p-6 rounded" onSubmit={handleSubmit}>
        
        <div>
          <label className="block mb-1">Job Title</label>
          <input
            name="title"
            className="border p-2 rounded w-full"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            className="border p-2 rounded w-full h-32"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            name="location"
            className="border p-2 rounded w-full"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="remote"
              checked={form.remote}
              onChange={handleChange}
            />
            Remote Position?
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Salary Min</label>
            <input
              name="salaryMin"
              type="number"
              className="border p-2 rounded w-full"
              value={form.salaryMin}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Salary Max</label>
            <input
              name="salaryMax"
              type="number"
              className="border p-2 rounded w-full"
              value={form.salaryMax}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Skills (comma-separated)</label>
          <input
            name="tags"
            className="border p-2 rounded w-full"
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        <button
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
 
