
type Props = {
  filters: {
    keyword: string;
    location: string;
    remote: string;
    minSalary: string;
    maxSalary: string;
  };
  setFilters: (f: any) => void;
  onSearch: () => void;
};

const JobFilters = ({ filters, setFilters, onSearch }: Props) => {
  return (
    <div className="w-full bg-white shadow-md p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Keyword search */}
        <input
          type="text"
          placeholder="Search jobs (e.g. Software Engineer)"
          value={filters.keyword}
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              keyword: e.target.value,
            }))
          }
          className="border p-2 rounded-lg w-full"
        />

        {/* Location filter */}
        <input
          type="text"
          placeholder="Location (e.g. Bangalore)"
          value={filters.location}
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              location: e.target.value,
            }))
          }
          className="border p-2 rounded-lg w-full"
        />

        {/* Remote filter */}
        <select
          value={filters.remote}
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              remote: e.target.value,
            }))
          }
          className="border p-2 rounded-lg w-full"
        >
          <option value="">Remote / Onsite</option>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {/* Salary range */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Salary"
            value={filters.minSalary}
            onChange={(e) =>
              setFilters((prev: any) => ({
                ...prev,
                minSalary: e.target.value,
              }))
            }
            className="border p-2 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="Max Salary"
            value={filters.maxSalary}
            onChange={(e) =>
              setFilters((prev: any) => ({
                ...prev,
                maxSalary: e.target.value,
              }))
            }
            className="border p-2 rounded-lg w-full"
          />
        </div>
      </div>

      <button
        onClick={onSearch}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default JobFilters;
 
