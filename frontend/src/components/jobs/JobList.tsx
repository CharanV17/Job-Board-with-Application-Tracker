import { useEffect, useState } from "react";
import { jobService } from "../../services/job.service";
import JobFilterBar from "../../components/jobs/JobFilterBar";

import JobCard from "./JobCard";


export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (query = {}) => {
    setLoading(true);
    const data = await jobService.getJobs(query);
    setJobs(data.jobs ?? []);
    setLoading(false);
  };

  const handleFilter = (filters: any) => {
    fetchJobs(filters);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <JobFilterBar onFilter={handleFilter} />

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No jobs found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {jobs.map((job: any) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
