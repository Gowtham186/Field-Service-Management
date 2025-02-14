import { useNavigate } from "react-router-dom";

export default function Failed() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-red-600">Payment Failed ❌</h1>
                <p className="text-lg mt-4 text-gray-700">Oops! Something went wrong with your transaction.</p>
                <button 
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
