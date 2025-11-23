// Safely convert query params to numbers
export const parseNumber = (value: any, defaultValue: number = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

// Build filters for GET /jobs
export const buildJobFilters = (query: any) => {
  const filters: any = {};

  // Keyword search (title or description)
  if (query.keyword) {
    filters.$or = [
      { title: { $regex: query.keyword, $options: "i" } },
      { description: { $regex: query.keyword, $options: "i" } },
    ];
  }

  // Location
  if (query.location) {
    filters.location = { $regex: query.location, $options: "i" };
  }

  // Remote jobs
  if (query.remote) {
    filters.isRemote = query.remote === "true";
  }

  // Salary range
  const minSalary = parseNumber(query.minSalary, 0);
  const maxSalary = parseNumber(query.maxSalary, 0);

  if (minSalary > 0 || maxSalary > 0) {
    filters.salary = {};
    if (minSalary > 0) filters.salary.$gte = minSalary;
    if (maxSalary > 0) filters.salary.$lte = maxSalary;
  }

  return filters;
};
