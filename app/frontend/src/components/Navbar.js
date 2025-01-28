import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  return (
    <div className="bg-orange-500 h-11">
      <ul className="flex space-x-4">
        {isLoggedIn && user.role === "customer" ? (
          <>
            <li>
              <Link to="/dashboard" className="text-black-500 hover:text-blue-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/make-service" className="text-black-500 hover:text-blue-700">
                Make Service
              </Link>
            </li>
          </>
        ) : !isLoggedIn ? (
          <>
            <li>
              <Link to="/customerlogin" className="text-black-500 hover:text-blue-700">
                Login
              </Link>
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
  );
}
