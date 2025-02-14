import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentDetails } from "../redux/slices.js/customer-slice";
// import ReactStars from 'react-rating-stars-component'
import { Star } from 'lucide-react'
import { submitReview } from "../redux/slices.js/service-request-slice";

export default function Success() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { paymentDetails, loading, error } = useSelector((state) => state.customer);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [openReviewForm, setOpenReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        if (sessionId) {
            dispatch(fetchPaymentDetails(sessionId));
        }
    }, [dispatch, sessionId]);

    useEffect(() => {
        if (paymentDetails && paymentDetails.status === "paid") {
            setOpenReviewForm(true); 
        }
    }, [paymentDetails]);

    const handleSubmitReview = async () => {
        try{
            const reviewData = {
                rating,
                reviewText,
                serviceRequestId : paymentDetails.serviceRequestId
            };
            console.log("Review Submitted:", reviewData);
            await dispatch(submitReview({reviewData})).unwrap()
            setOpenReviewForm(false);
        }catch(err){
            console.log(err)
        }
    };
    
    if (loading) return <p className="text-center text-lg font-semibold">Loading payment details...</p>;
    if (error) return <p className="text-center text-red-500 font-semibold">Error: {error}</p>;
    
    const handleStarClick = (index)=>{
        // console.log(index + 1)
        setRating(index+1)
    }
    
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

            {/* Review Form Modal */}
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Rate Your Experience ⭐</h2>
                        
                        {/* Star Rating Component */}
                        <div className="flex justify-center space-x-2">
                            {[...Array(5)].map((_, index) => (
                                <Star
                                    key={index}
                                    size={20}
                                    className={`cursor-pointer ${index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                                    onClick={() => handleStarClick(index)}
                                />
                            ))}
                        </div>

                        {/* Review Text */}
                        <textarea
                            className="w-full border p-2 mt-3 rounded-lg"
                            placeholder="Write your review..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>

                        <div className="flex justify-end mt-4">
                            <button 
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                                onClick={() => setOpenReviewForm(false)}
                            >
                                Skip
                            </button>
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={handleSubmitReview}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            {/* {openReviewForm && (
            )} */}
        </div>
    );
}
