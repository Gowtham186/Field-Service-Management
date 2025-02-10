import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices.js/user-slice";

export default function Sidebar({ role }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user)

  const handleLogout = ()=>{
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/')
  }
  return (
    <div className="bg-blue-950 h-screen p-4 shadow-md fixed transition-all duration-300 w-24 md:w-48">
      <ul className="space-y-4">
        {role === "expert" && (
          <>
          <div>
            <h1 className="text-2xl text-white mb-1">{user && user.name}</h1>
            <button className="mb-3 text-white"
              onClick={()=> {
                navigate(`/expert/profile/${user._id}`)
              }}
            >view profile</button>
            <hr />
          </div>
          <li>
            <Link to="/expert-dashboard" className="text-white hover:text-blue-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/new-bookings" className="text-white hover:text-blue-700">
              New Bookings
            </Link>
          </li>
          <li>
            <Link to="/experts/calendar" className="text-white hover:text-blue-700">
              My Calendar
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
          <div>
            <h1 className="text-2xl text-white mb-1">{user && user.name}</h1>
            <button className="mb-3 text-white"
              onClick={()=> {
                navigate(`/expert/profile/${user._id}`)
              }}
            >view profile</button>
            <hr />
          </div>
          <li>
            <Link to="/admin-dashboard" className="text-white hover:text-blue-700">
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link to="/verify-experts" className="text-white hover:text-blue-700">
              Verify Experts
            </Link>
          </li>
          <li>
            <Link to="/manage-experts" className="text-white hover:text-blue-700">
              Manage Experts
            </Link>
          </li>
          <li>
            <Link to="/manage-categories" className="text-white hover:text-blue-700">
              Manage Categories & Services
            </Link>
          </li>
          <li>
            <Link to="/manage-bookings" className="text-white hover:text-blue-700">
              Manage Bookings
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
