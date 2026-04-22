import type { Job } from "../../types/job";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{job.title}</h2>

      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>

      {job.isRemote && (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
          Remote
        </span>
      )}

      <p className="mt-2 text-blue-600 font-semibold">
        ₹{job.salaryMin} - ₹{job.salaryMax}
      </p>
    </div>
  );
}
