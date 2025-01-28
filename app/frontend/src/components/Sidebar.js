import { Link } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div className="bg-blue-950 w-52 h-screen p-4 shadow-md fixed">
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="text-white hover:text-blue-700">
            Dashboard
          </Link>
        </li>
        {role === "expert" && (
          <li>
            <Link to="/service-requests" className="text-white hover:text-blue-700">
              Service Requests
            </Link>
          </li>
        )}
        {role === "admin" && (
          <li>
            <Link to="/verify-experts" className="text-black-500 hover:text-blue-700">
              Manage Experts
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
