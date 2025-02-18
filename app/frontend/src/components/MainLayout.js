import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  return (
    <div>
      {/* Show Sidebar for expert or admin */}
      {isLoggedIn && (user.role === "expert" || user.role === "admin") ? (
        <>
          <Sidebar role={user.role} />
          <div className="flex-grow ml-52 p-4">{children}</div>
        </>
      ) : (
        // Show Navbar for customer or when not logged in
        <>
          <div className="w-full">
            <Navbar />
          </div>
          <div className="w-full p-4 mt-20"> {/* Add mt-20 to give spacing for navbar */}
            {children}
          </div>
        </>
      )}
    </div>
  );
}
