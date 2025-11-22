import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow py-3 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        JobBoard
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "candidate" && (
              <Link to="/candidate/dashboard" className="font-medium">
                Dashboard
              </Link>
            )}

            {user.role === "employer" && (
              <Link to="/employer/dashboard" className="font-medium">
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
