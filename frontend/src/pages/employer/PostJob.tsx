import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function PostJob() {
  const navigate = useNavigate();
  const token = useAuthStore((s: any) => s.token);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    isRemote: false
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:4000/api/jobs",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate("/employer/jobs"); // after posting → job list

    } catch (err: any) {
      setError("Failed to post job");
      console.log(err.response?.data);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Job Title"
          className="w-full border p-3 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Company Name"
          className="w-full border p-3 rounded"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-3 rounded"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min Salary"
            className="w-full border p-3 rounded"
            onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
          />

          <input
            type="number"
            placeholder="Max Salary"
            className="w-full border p-3 rounded"
            onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Job Description"
          className="w-full border p-3 rounded h-32"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
          />
          Remote Job
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
