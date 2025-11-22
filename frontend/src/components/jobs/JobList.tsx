import { useState, useEffect } from "react";
import { jobService } from "../../services/job.service";
import JobFilterBar from "../../components/jobs/JobFilterBar";

export default function JobList() {
  const [filters, setFilters] = useState({});
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    const data = await jobService.getJobs(params);
    setJobs(data.jobs || data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilter = (f: any) => {
    const params: any = {};

    if (f.search) params.search = f.search;
    if (f.location) params.location = f.location;
    if (f.remote) params.remote = true;
    if (f.salaryMin) params.salaryMin = Number(f.salaryMin);
    if (f.salaryMax) params.salaryMax = Number(f.salaryMax);

    fetchJobs(params);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 🔍 Filter Bar */}
      <JobFilterBar onFilter={handleFilter} />

      <h1 className="text-3xl font-semibold mt-6 mb-4">Available Jobs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-4 shadow rounded bg-white">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-500 text-sm mt-1">
                Salary: ₹{job.salaryMin} - ₹{job.salaryMax}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
