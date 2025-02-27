import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();
    console.log(user)
    const handleGoHome = () => {
        if (!user || !user.role) {
            console.log(user.role)
            navigate("/"); 
            return;
        }

        const routes = {
            admin: "/admin-dashboard",
            expert: "/expert-dashboard",
            customer: "/"
        };

        navigate(routes[user.role] || "/"); 
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
            <div className="text-center p-10 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-2xl max-w-md w-full border border-gray-300 dark:border-gray-700">
                <h1 className="text-6xl font-bold text-red-500 dark:text-red-400 mb-4">401</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Access Denied 🚫
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don’t have permission to view this page. <br />
                    If you believe this is a mistake, contact support.
                </p>
                <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-6">
                    "Sometimes the best doors are the ones that stay closed. 🔒"
                </p>
                <button
                    onClick={handleGoHome}
                    className="px-6 py-3 bg-blue-500 dark:bg-blue-700 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition"
                >
                    ⬅️ Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
