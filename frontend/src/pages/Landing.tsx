import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="text-center py-20 bg-gray-50 rounded-xl shadow-lg">
      
      {/* Title/Slogan */}
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Find Your Dream Job Today
      </h1>
      <p className="text-xl text-indigo-600 mb-10 max-w-2xl mx-auto">
        Connecting top talent with the best employers in the industry.
      </p>

      {/* Call to Action Buttons: ORGANIZED AND COLORED */}
      <div className="flex justify-center space-x-6">
        <Link 
          to="/jobs" 
          className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
        >
          Browse Jobs
        </Link>
        <Link 
          to="/register" 
          className="px-8 py-3 text-lg font-semibold text-indigo-600 border border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition duration-150"
        >
          Start Hiring
        </Link>
      </div>
    </div>
  );
}