import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import CustomerLogin from "../pages/CustomerLogin";
import { logout } from "../redux/slices.js/user-slice";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

const handleLogout = ()=>{
  dispatch(logout())
  localStorage.removeItem('token')
  navigate('/')

}

  return (
    <div>
      <div className="bg-orange-500 h-11">
        <ul className="flex space-x-4">
          {isLoggedIn && user.role === "customer" ? (
            <>
              <li>
                <Link to="/" className="text-black-500 hover:text-blue-700">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/make-service" className="text-black-500 hover:text-blue-700">
                  Make Service
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-black-500 hover:text-blue-700">
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : !isLoggedIn ? (
            <>
              <li>
                <button
                  onClick={openLogin}
                  className="text-black-500 hover:text-blue-700"
                >
                  Login
                </button>
              </li>
              <li>
                <Link to="/expertlogin" className="text-black-500 hover:text-blue-700">
                  Other Login
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>

      {isLoginOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative z-50 bg-white shadow-lg rounded-lg w-96 p-6">
            <CustomerLogin closeLogin={closeLogin} />
          </div>
        </div>
      )}
    </div>
  );
}
