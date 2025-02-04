import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices.js/user-slice";

export default function Sidebar({ role }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = ()=>{
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/')
  }
  return (
    <div className="bg-blue-950 h-screen p-4 shadow-md fixed transition-all duration-300 w-24 md:w-48">
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="text-white hover:text-blue-700">
            Dashboard
          </Link>
        </li>
        {role === "expert" && (
          <>
          <li>
            <Link to="/service-requests" className="text-white hover:text-blue-700">
              Service Requests
            </Link>
          </li>
          <li>
            <Link to="/experts/availability" className="text-white hover:text-blue-700">
              Manage availability
            </Link>
          </li>
          <li>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </li>
        </>
        )}
        {role === "admin" && (
          <>
          <li>
            <Link to="/verify-experts" className="text-white hover:text-blue-700">
              Manage Experts
            </Link>
          </li>
          <li>
            <Link to="/manage-categories" className="text-white hover:text-blue-700">
              Manage Categories & Services
            </Link>
          </li>
          <li>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </li>
          </>
        )}
      </ul>
    </div>
  );
}
