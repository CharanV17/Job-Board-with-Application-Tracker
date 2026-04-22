import { Link } from "react-router-dom";

export default function Navbar() {
  // NOTE: This should be replaced with actual state/context management later
  const isAuthenticated = false; 

  return (
    // Outer Nav: Sets the background color and shadow
    <nav className="bg-indigo-700 shadow-lg">
      
      {/* Inner Container: Centers content and provides padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Flex Row: Organizes content (Logo left, Links right) */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand Name (Left Side) */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white tracking-wider hover:text-indigo-200 transition duration-150 ease-in-out">
              💼 JobBoard
            </Link>
          </div>

          {/* Navigation Links (Right Side) */}
          <div className="flex space-x-6 items-center">
            {isAuthenticated ? (
              // Links for Authenticated Users (Example: Dashboard, Logout)
              <>
                <Link to="/profile" className="text-white hover:text-indigo-200 transition duration-150 ease-in-out font-medium">
                  Profile
                </Link>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded transition duration-150 ease-in-out"
                  // onClick={handleLogout} 
                >
                  Logout
                </button>
              </>
            ) : (
              // Links for Public/Guest Users (Login, Register)
              <>
                <Link to="/login" className="text-white hover:text-indigo-200 transition duration-150 ease-in-out font-medium">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  // Use white background button for primary CTA
                  className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold py-1.5 px-4 rounded-md shadow-lg transition duration-150 ease-in-out border border-transparent"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}