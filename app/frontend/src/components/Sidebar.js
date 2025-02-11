import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices.js/user-slice";

export default function Sidebar({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-blue-950 h-screen p-4 shadow-md fixed transition-all duration-300 w-24 md:w-48">
      <ul className="space-y-4">
        <div>
          <h1 className="text-2xl text-white mb-1">{user && user.name}</h1>
          <button
            className="mb-3 text-white"
            onClick={() => navigate(`/expert/profile/${user._id}`)}
          >
            View Profile
          </button>
          <hr />
        </div>

        {role === "expert" && (
          <>
            <li>
              <Link
                to="/expert-dashboard"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/expert-dashboard") ? "border-white" : "border-transparent"
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/new-bookings"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/new-bookings") ? "border-white" : "border-transparent"
                }`}
              >
                New Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/experts/calendar"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/experts/calendar") ? "border-white" : "border-transparent"
                }`}
              >
                My Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/experts/availability"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/experts/availability") ? "border-white" : "border-transparent"
                }`}
              >
                Manage Availability
              </Link>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li>
              <Link
                to="/admin-dashboard"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/admin-dashboard") ? "border-white" : "border-transparent"
                }`}
              >
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/verify-experts"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/verify-experts") ? "border-white" : "border-transparent"
                }`}
              >
                Verify Experts
              </Link>
            </li>
            <li>
              <Link
                to="/manage-experts"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/manage-experts") ? "border-white" : "border-transparent"
                }`}
              >
                Manage Experts
              </Link>
            </li>
            <li>
              <Link
                to="/manage-categories"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/manage-categories") ? "border-white" : "border-transparent"
                }`}
              >
                Manage Categories & Services
              </Link>
            </li>
            <li>
              <Link
                to="/manage-bookings"
                className={`block text-white hover:text-blue-700 pl-4 border-l-4 ${
                  isActive("/manage-bookings") ? "border-white" : "border-transparent"
                }`}
              >
                Manage Bookings
              </Link>
            </li>
          </>
        )}

        <li>
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
