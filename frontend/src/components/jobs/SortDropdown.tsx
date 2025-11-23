export default function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    >
      <option value="date">Newest</option>
      <option value="relevance">Relevance</option>
      <option value="salaryDesc">Salary: High → Low</option>
      <option value="salaryAsc">Salary: Low → High</option>
    </select>
  );
}
