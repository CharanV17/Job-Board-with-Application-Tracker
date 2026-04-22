import { useEffect, useState } from "react";
import { jobService } from "../../services/job.service";
import { Link } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [sort, setSort] = useState("date");

  const limit = 10;

  // ============================
  // Fetch jobs based on filters
  // ============================
  const fetchJobs = async () => {
    const data = await jobService.getJobs({
      q: query || undefined,
      location: location || undefined,
      remote: remote || undefined,
      minSalary: minSalary || undefined,
      maxSalary: maxSalary || undefined,
      sort,
      page,
      limit,
    });

    setJobs(data.jobs);
    setPages(data.pages);
  };

  // Fetch when page / sort changes
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">Find Jobs</h1>

      {/* SEARCH + FILTERS UI */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow mb-6"
      >
        {/* Keyword Search */}
        <input
          type="text"
          placeholder="Search jobs..."
          className="border p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Remote */}
        <select
          className="border p-2 rounded w-full"
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
        >
          <option value="">Remote or On-site</option>
          <option value="true">Remote Only</option>
          <option value="false">On-Site</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {/* Salary Range */}
        <input
          type="number"
          placeholder="Min Salary"
          className="border p-2 rounded w-full"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Salary"
          className="border p-2 rounded w-full"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
        />

        {/* Search Button */}
        <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 md:col-span-5">
          Search
        </button>
      </form>

      {/* SORTING */}
      <div className="flex justify-end mb-4">
        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="date">Newest</option>
          <option value="salary">Salary (High First)</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>

      {/* JOB LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job: any) => (
          <Link
            key={job._id}
            to={`/jobs/${job._id}`}
            className="block p-4 bg-white shadow rounded hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.location || "—"}</p>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>
                💰 {job.salaryMin || 0} - {job.salaryMax || 0}
              </span>
              {job.remote && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  Remote
                </span>
              )}
            </div>
          </Link>
        ))}

        {jobs.length === 0 && (
          <div className="text-center text-gray-500 col-span-full">
            No jobs found.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center mt-6 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
