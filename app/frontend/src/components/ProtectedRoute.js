import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
export default function ProtectedRoute({ children }) {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();

    if (!localStorage.getItem("token") && !user) {
        const isLoggingOut = localStorage.getItem("isLoggingOut");
        
        // Prevent redirecting to "/customerlogin" if logging out
        if (!isLoggingOut) {
            alert("Please log in to access the page.");
            localStorage.setItem("prevPath", location.pathname);
            return <Navigate to="/customerlogin" replace />;
        }
    }

    // Clear logout flag after handling
    localStorage.removeItem("isLoggingOut");
    
    return children;
}
