import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentDetails } from "../redux/slices.js/customer-slice";
// import ReactStars from 'react-rating-stars-component'
import { Star } from 'lucide-react'
import { submitReview } from "../redux/slices.js/service-request-slice";

export default function BookingfeeSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { paymentDetails, loading, error } = useSelector((state) => state.customer);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id")

    useEffect(() => {
        if (sessionId) {
            dispatch(fetchPaymentDetails(sessionId));
        }
    }, [dispatch, sessionId]);

    useEffect(() => {
        if (paymentDetails && paymentDetails.status === "paid") {
            
        }
    }, [paymentDetails]);
    
    if (loading) return <p className="text-center text-lg font-semibold">Loading payment details...</p>;
    if (error) return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;
    
    
    const handleGoHome = ()=>{
        navigate("/");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-green-600">Payment Successful! ✅</h1>
                {paymentDetails ? (
                    <div className="mt-4 text-lg">
                        <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
                        <p><strong>Amount Paid:</strong> ₹{(paymentDetails.amount / 100).toFixed(2)}</p>
                        <p><strong>Payment Status:</strong> {paymentDetails.status}</p>
                    </div>
                ) : (
                    <p className="text-gray-600">Payment details not found.</p>
                )}
                <button 
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleGoHome}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
