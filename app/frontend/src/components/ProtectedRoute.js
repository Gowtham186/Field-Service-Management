import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();

    // If user is not authenticated
    if (!localStorage.getItem("token") && !user) {
        alert("Please log in to access this page.");
        
        // Store the previous path before redirecting
        localStorage.setItem("prevPath", location.pathname);

        // role-based redirection
        const loginPath = role === "expert" || role === "admin" ? "/expertlogin" : "/customerlogin";
        return <Navigate to={loginPath} replace />;
    }

    // If user is logged in but has the wrong role
    if (user && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
