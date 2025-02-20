import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices.js/user-slice";

export default function Sidebar({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.setItem("isLoggingOut", "true"); // Flag to prevent unwanted redirects
    navigate("/"); // Navigate first

    setTimeout(() => {
        dispatch(logout());  
        localStorage.removeItem("token");
    }, 100); // Delay Redux state update slightly
};




  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
<div className="bg-blue-950 h-screen p-4 shadow-md fixed transition-all duration-300 w-24 md:w-48">      
  <ul className="space-y-4 relative">
        <div>
          <h1 className="text-xl text-white mb-1">{user && user.name}</h1>
          <button
            className="mb-3 text-white text-"
            onClick={() => navigate(`/expert/profile/${user._id}`)}
          >
            View Profile
          </button>
          <hr />
        </div>

        {role === "expert" && (
          <>
            <li className="relative">
              <Link
                to="/expert-dashboard"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/expert-dashboard") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Dashboard
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/new-bookings"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/new-bookings") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                New Bookings
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/experts/calendar"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/experts/calendar") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                My Calendar
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/experts/availability"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/experts/availability") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Manage Availability
              </Link>
            </li>
            <li className="relative">
              <Link
                to={`/experts/${user?._id}/history`}
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive(`/experts/${user._id}/history`) && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Manage History
              </Link>
            </li>

            <li className="relative">
              <Link
                to="/experts/revenue"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/experts/revenue") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Revenue
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/experts/bookings-analytics"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/experts/bookings-analytics") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Analytics
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/experts/reviews"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/experts/reviews") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Ratings & Reviews
              </Link>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li className="relative">
              <Link
                to="/admin-dashboard"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/admin-dashboard") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Admin Dashboard
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/verify-experts"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/verify-experts") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Verify Experts
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/manage-experts"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/manage-experts") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Manage Experts
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/manage-categories"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/manage-categories") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Manage Categories & Services
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/manage-bookings"
                className={`block text-white text-sm hover:text-blue-700 pl-4 relative`}
              >
                {isActive("/manage-bookings") && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white"></span>
                )}
                Manage Bookings
              </Link>
            </li>
            
          </>
        )}

        <li>
          <button onClick={handleLogout} className="text-white text-sm">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
