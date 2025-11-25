import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-200">
            💼 JobBoard
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="sm:hidden text-3xl text-white"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          {/* NAV LINKS */}
          <div className={`${open ? "block" : "hidden"} sm:flex gap-6 items-center font-medium`}>
            
            {/* Browse Jobs - visible to all */}
            <Link to="/jobs" className="text-white hover:text-indigo-200">
              Browse Jobs
            </Link>

            {!user ? (
              <>
                <Link to="/login" className="text-white hover:text-indigo-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold py-1.5 px-4 rounded-md shadow"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === "candidate" && (
                  <Link to="/candidate/dashboard" className="text-white hover:text-indigo-200">
                    Dashboard
                  </Link>
                )}

                {user.role === "employer" && (
                  <Link to="/employer/dashboard" className="text-white hover:text-indigo-200">
                    Dashboard
                  </Link>
                )}

                <Link to="/profile" className="text-white hover:text-indigo-200">
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded shadow"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
