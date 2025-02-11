import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import CustomerLogin from "../pages/CustomerLogin";
import { logout } from "../redux/slices.js/user-slice";

export default function Navbar({ setIsLoginOpen, isLoginOpen }) {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div className="bg-orange-500 h-14 flex items-center px-6 shadow-md">
        {/* Brand Name */}
        <Link to="/" className="text-white font-bold text-xl hover:text-blue-200">
          FixItNow
        </Link>

        {/* Navigation Links */}
        <ul className="ml-auto flex space-x-6 text-white">
          {isLoggedIn && user.role === "customer" ? (
            <>
              <li>
                <Link to="/my-bookings" className="hover:text-blue-200">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-200">
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-blue-200">
                  Logout
                </button>
              </li>
            </>
          ) : !isLoggedIn ? (
            <>
              <li>
                <button onClick={openLogin} className="hover:text-blue-200">
                  Login
                </button>
              </li>
              <li>
                <Link to="/expertlogin" className="hover:text-blue-200">
                  Other Login
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>

      {/* Blur Overlay when Login is Open */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40"></div>
      )}

      {isLoginOpen && (
        <div className="fixed top-40 right-1 bottom-0 z-50 flex items-center justify-center">
          <CustomerLogin closeLogin={closeLogin} />
        </div>
      )}
    </div>
  );
}
