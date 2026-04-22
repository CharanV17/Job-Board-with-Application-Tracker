import { useState } from "react";
import { jobService } from "../../services/job.service";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
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
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
      };

      await jobService.createJob(payload, token);

      navigate("/employer/jobs");
    } catch (err) {
      console.error(err);
      setError("Failed to create job");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full border p-2 rounded"
          placeholder="Job Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Company"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Location"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
          />
          Remote
        </label>

        <div className="flex gap-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Min Salary"
            onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
            required
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Max Salary"
            onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
            required
          />
        </div>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Job Description"
          rows={4}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        ></textarea>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Job
        </button>
      </form>
    </div>
  );
}
