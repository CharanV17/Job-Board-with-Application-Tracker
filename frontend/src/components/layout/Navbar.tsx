import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // ⬅️ mobile toggle state

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false); // close menu after logout
  };

  return (
    <nav className="w-full bg-white shadow py-3 px-6 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600"
        onClick={() => setOpen(false)}
      >
        JobBoard
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden text-2xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Navigation Links — responsive */}
      <div
        className={`sm:flex gap-6 items-center ${
          open ? "block mt-4" : "hidden"
        } sm:mt-0`}
      >
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-blue-600 font-medium"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
              onClick={() => setOpen(false)}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "candidate" && (
              <Link
                to="/candidate/dashboard"
                className="font-medium"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {user.role === "employer" && (
              <Link
                to="/employer/dashboard"
                className="font-medium"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded inline-block"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
