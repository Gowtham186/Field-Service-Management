import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Edit, X, CalendarDays, ShoppingCart, ClipboardList, UserRound } from "lucide-react"; // Importing icons

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
    localStorage.removeItem("token");  
    dispatch(logout());  
    setIsProfileOpen(false);  
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
    dispatch(updateUser(editData));
    setIsEditOpen(false);
  };

  return (
    <div>
      {/* Navbar with dynamic color */}
      <div className='bg-orange-500 h-14 min-h-[56px] flex items-center px-6 shadow-md fixed top-0 left-0 w-full z-50'>
        {(user?.role === "customer" || !isLoggedIn) ? (
          <Link to="/" className="text-white font-bold text-xl hover:text-blue-200">
            FixItNow
          </Link>
        ) : (
          <h1 className="text-white font-bold text-xl">FixItNow</h1>
        )}

        <ul className="ml-auto flex space-x-6 text-white">
          {isLoggedIn && user?.role === "customer" ? (
            <>
              <li>
                <Link to="/my-bookings" className="hover:text-blue-200" title="My Bookings">
                <ClipboardList size={20} />
                </Link>
              </li>
              <li>
                <Link to="/my-calendar" className="hover:text-blue-200 flex items-center space-x-1" title="My Calendar">
                  <CalendarDays size={18} />
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-200 flex items-center space-x-1" title="My Cart">
                  <ShoppingCart size={20} />
                </Link>
              </li>

              <li className="relative" ref={profileRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="hover:text-blue-200 focus:outline-none">
                <UserRound size={20} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white text-black shadow-md rounded-md p-3 z-50">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{user.name}</p>
                      <button onClick={() => { setIsEditOpen(true); setIsProfileOpen(false); }} className="text-gray-500 hover:text-gray-700">
                        <Edit size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{user?.phone_number}</p>
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="w-full text-left text-sm text-red-600 hover:text-red-800">
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : !isLoggedIn ? (
            <>
              <li>
                  <Link to="/cart" className="text-white hover:text-blue-400 flex items-center mt-1">
                    <ShoppingCart size={20} />
                  </Link>
                </li>
                <li>
                <button 
                  onClick={openLogin} 
                  className="bg-white text-sm text-orange-500 border border-orange-500 px-4 py-1 rounded-full hover:bg-orange-500 hover:text-white transition  font-semibold"
                >
                  Login
                </button>
              </li>
              <li>
                <Link to="/expertlogin">
                  <button className="bg-white text-sm text-orange-500 border border-orange-500 px-4 py-1 rounded-full hover:bg-orange-500 hover:text-white transition font-semibold">
                    I'm an expert
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout} className="hover:text-blue-200">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {isLoginOpen && <CustomerLogin closeLogin={closeLogin} />}

      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-5 rounded-lg shadow-lg relative">
            <button onClick={() => setIsEditOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
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
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
