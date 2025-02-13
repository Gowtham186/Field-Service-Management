import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Success(){
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            fetchPaymentDetails(sessionId);
        }
    }, [sessionId]);

    const fetchPaymentDetails = async (sessionId) => {
        try {
            const response = await fetch(`/api/payment/details?session_id=${sessionId}`);
            console.log(response.data)
            const data = await response.json();
            setPaymentDetails(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payment details:", error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading payment details...</p>;

    return (
        <div>
            <h1>Payment Successful!</h1>
            {paymentDetails ? (
                <div>
                    <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
                    <p><strong>Amount Paid:</strong> ₹{(paymentDetails.amount / 100).toFixed(2)}</p>
                    <p><strong>Payment Status:</strong> {paymentDetails.status}</p>
                </div>
            ) : (
                <p>Payment details not found.</p>
            )}
        </div>
    );
};