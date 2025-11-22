import { useState } from "react";
import { jobService } from "../../services/job.service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function CreateJob() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Redirect if not employer
  if (!user || user.role !== "employer") {
    navigate("/jobs");
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    remote: false,
    salaryMin: "",
    salaryMax: "",
    tags: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobService.createJob({
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      });

      alert("Job created successfully!");
      navigate("/employer/dashboard");

    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create job");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Create New Job</h1>

      <form className="space-y-5 bg-white shadow p-6 rounded" onSubmit={handleSubmit}>
        
        <div>
          <label className="block mb-1">Job Title</label>
          <input
            name="title"
            className="border p-2 rounded w-full"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            className="border p-2 rounded w-full h-32"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            name="location"
            className="border p-2 rounded w-full"
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
            placeholder="JavaScript, React, Node.js"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}

