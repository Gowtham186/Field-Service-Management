import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Edit, X, CalendarDays, ShoppingCart } from "lucide-react"; // Importing icons

import CustomerLogin from "../pages/CustomerLogin";
import { logout, updateUser } from "../redux/slices.js/user-slice"; // Import updateUser action

export default function Navbar({ setIsLoginOpen, isLoginOpen }) {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const profileRef = useRef(null);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
  });

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log(editData);
    dispatch(updateUser(editData));
    setIsEditOpen(false);
  };

  return (
    <div>
      <div className="bg-orange-500 h-14 flex items-center px-6 shadow-md">
        <Link to="/" className="text-white font-bold text-xl hover:text-blue-200">
          FixItNow
        </Link>

        <ul className="ml-auto flex space-x-6 text-white">
          {isLoggedIn && user?.role === "customer" ? (
            <>
              <li>
                <Link to="/my-bookings" className="hover:text-blue-200">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-200 flex items-center space-x-1">
                  <ShoppingCart size={20} className="text-white hover:text-blue-200" />                
                </Link>
              </li>
              <li>
                <Link to="/my-calendar" className="hover:text-blue-200 flex items-center space-x-1">
                  <CalendarDays size={18} />
                  <span>My Calendar</span>
                </Link>
              </li>

              <li className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hover:text-blue-200 focus:outline-none"
                >
                  Profile
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white text-black shadow-md rounded-md p-3 z-50">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{user.name}</p>
                      <button
                        onClick={() => {
                          setIsEditOpen(true);
                          setIsProfileOpen(!isProfileOpen);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{user?.phone_number}</p>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-sm text-red-600 hover:text-red-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : !isLoggedIn ? (
            <>
              <li>
                <Link to="/cart" className="hover:text-blue-200 flex items-center mt-1">
                <ShoppingCart size={20} className="text-white hover:text-blue-200" />                
                </Link>
              </li>
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

      {isLoginOpen && <CustomerLogin closeLogin={closeLogin} />}

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-5 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSaveChanges}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-400"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={editData.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
