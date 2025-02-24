import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices.js/user-slice";
import { 
  LogOut, User, Calendar, History, DollarSign, 
  BarChart, Star, ShieldCheck, Users, List, Clipboard 
} from "lucide-react";

export default function Sidebar({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.setItem("isLoggingOut", "true");
    navigate("/");
    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem("token");
    }, 100);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-blue-950 h-screen p-4 shadow-md fixed transition-all duration-300 w-24 md:w-48 flex flex-col">
      <ul className="space-y-4 flex-grow">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">FixItNow</h1>
          <hr />
          <h1 className="text-xl text-white mb-1">{user && user.name}</h1>
          <button
            className="mb-3 text-white text-sm flex items-center gap-2"
            onClick={() => navigate(`/expert/profile/${user._id}`)}
          >
            <User size={16} />
            View Profile
          </button>
          <hr />
        </div>

        {role === "expert" && (
          <>
            <li>
              <Link
                to="/expert-dashboard"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/expert-dashboard") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <Clipboard size={16} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/new-bookings"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/new-bookings") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <List size={16} />
                New Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/experts/calendar"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/experts/calendar") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <Calendar size={16} />
                My Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/experts/availability"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/experts/availability") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <ShieldCheck size={16} />
                Manage Availability
              </Link>
            </li>
            <li>
              <Link
                to={`/experts/${user?._id}/history`}
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive(`/experts/${user?._id}/history`) ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <History size={16} />
                Manage History
              </Link>
            </li>
            <li>
              <Link
                to="/experts/revenue"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/experts/revenue") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <DollarSign size={16} />
                Revenue
              </Link>
            </li>
            <li>
              <Link
                to="/experts/bookings-analytics"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/experts/bookings-analytics") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <BarChart size={16} />
                Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/experts/reviews"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/experts/reviews") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <Star size={16} />
                Ratings & Reviews
              </Link>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li>
              <Link
                to="/admin-dashboard"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/admin-dashboard") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <Clipboard size={16} />
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/verify-experts"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/verify-experts") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <ShieldCheck size={16} />
                Verify Experts
              </Link>
            </li>
            <li>
              <Link
                to="/manage-experts"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/manage-experts") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <Users size={16} />
                Manage Experts
              </Link>
            </li>
            <li>
              <Link
                to="/manage-categories"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/manage-categories") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <List size={16} />
                Manage Categories & Services
              </Link>
            </li>
            <li>
              <Link
                to="/manage-bookings"
                className={`relative text-white text-sm flex items-center gap-2 ${
                  isActive("/manage-bookings") ? "border-l-2 border-white pl-2" : ""
                }`}
              >
                <Clipboard size={16} />
                Manage Bookings
              </Link>
            </li>
          </>
        )}
      </ul>
      <hr className="mb-3"/>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="text-white text-sm flex items-center gap-2 w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
