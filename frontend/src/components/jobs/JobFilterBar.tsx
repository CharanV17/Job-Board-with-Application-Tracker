import { useState } from "react";

interface Props {
  onFilter: (filters: any) => void;
}

export default function JobFilterBar({ onFilter }: Props) {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    remote: false,
    salaryMin: "",
    salaryMax: ""
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  return (
    <div className="bg-white shadow p-4 rounded mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <input
          name="search"
          placeholder="Search title / skills"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="remote"
            onChange={handleChange}
          />
          Remote?
        </label>

        <input
          name="salaryMin"
          type="number"
          placeholder="Min Salary"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="salaryMax"
          type="number"
          placeholder="Max Salary"
          className="border p-2 rounded"
          onChange={handleChange}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
