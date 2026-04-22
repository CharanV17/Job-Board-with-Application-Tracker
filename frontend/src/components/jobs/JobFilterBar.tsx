import { useState } from "react";
import SortDropdown from "./SortDropdown";

export default function JobFilterBar({ onFilter }: any) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState("all");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [sort, setSort] = useState("date");

  const apply = () => {
    onFilter({
      keyword,
      location,
      minSalary: minSalary ? Number(minSalary) : undefined,
      maxSalary: maxSalary ? Number(maxSalary) : undefined,
      remote: remote === "all" ? undefined : remote === "remote",
      sort,
    });
  };

  return (
    <div className="bg-white shadow p-4 rounded mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <input
          className="border p-2 rounded w-full"
          placeholder="Keyword (React, Backend...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Location (Bengaluru...)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
        >
          <option value="all">Remote + On-site</option>
          <option value="remote">Remote Only</option>
          <option value="onsite">On-site Only</option>
        </select>

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Salary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Min ₹"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Max ₹"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
        />

        <button
          onClick={apply}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full col-span-2 sm:col-span-1"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
