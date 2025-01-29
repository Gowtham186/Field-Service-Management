import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Navbar />;
  }

  return (
    <div className="flex">
      {user.role === "expert" || user.role === "admin" ? (
        <>
          <Sidebar role={user.role} />
          <div className="flex-grow ml-40 p-4">{children}</div>
        </>
      ) : (
        <>
          <Navbar />
          <div className="p-4">{children}</div>
        </>
      )}
    </div>
  );
}
