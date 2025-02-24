import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();

    const handleGoHome = () => {
        if (!user || !user.role) {
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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
            <div className="text-center p-10 bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-2xl max-w-md w-full border border-gray-300 dark:border-gray-700">
                <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Uh-oh! This Page is Lost in Space 🌌
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Looks like you’ve traveled too far into the internet.  
                    Let’s bring you back to safety! 🏠
                </p>
                <button
                    onClick={handleGoHome}
                    className="px-6 py-3 bg-indigo-500 dark:bg-indigo-700 text-white text-lg font-semibold rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-800 transition"
                >
                    🚀 Take Me Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
