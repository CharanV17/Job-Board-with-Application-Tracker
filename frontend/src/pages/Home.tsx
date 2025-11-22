import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const goToSearch = (e: any) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/jobs?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Browse thousands of jobs or post a job to find the perfect candidate.
          </p>

          {/* SEARCH BAR */}
          <form
            onSubmit={goToSearch}
            className="flex max-w-xl mx-auto bg-white shadow rounded-lg overflow-hidden"
          >
            <input
              type="text"
              name="search"
              placeholder="Search jobs (title, skill, location...)"
              className="flex-1 p-3 outline-none"
            />

            <button className="bg-blue-600 text-white px-5 hover:bg-blue-700">
              Search
            </button>
          </form>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              to="/jobs"
              className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Browse Jobs
            </Link>

            {user?.role === "employer" && (
              <Link
                to="/employer/jobs/create"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post a Job
              </Link>
            )}

            {!user && (
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Powerful Search</h3>
            <p className="text-gray-600">
              Filter by title, skills, location, salary, remote and more.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Track Applications</h3>
            <p className="text-gray-600">
              Candidates track progress through Applied → Interview → Offer.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Post Jobs Easily</h3>
            <p className="text-gray-600">
              Employers can post, update and manage applications effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to get started?</h2>

        {user ? (
          <Link
            to={user.role === "candidate" ? "/jobs" : "/employer/jobs/create"}
            className="px-8 py-3 bg-white text-blue-600 rounded font-semibold hover:bg-gray-100"
          >
            Continue
          </Link>
        ) : (
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-blue-600 rounded font-semibold hover:bg-gray-100"
          >
            Create an Account
          </Link>
        )}
      </section>
    </div>
  );
}
