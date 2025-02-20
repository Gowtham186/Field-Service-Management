import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { addOnSiteService, customerBookingStatusUpdated, removeOnSiteService, updateNewBooking } from "../redux/slices.js/customer-slice";  
import { addNewService, expertBookingStatusUpdated } from "../redux/slices.js/expert-slice";

const socket = io("http://localhost:4500", { reconnection: true });

const NotificationComponent = ({ userId, role }) => {
    const dispatch = useDispatch();

    // Separate useEffect to join socket room when userId changes
    useEffect(() => {
        if (!userId || !role) return;

        if (role === "customer") {
            socket.emit("joinCustomer", { userId });
        }

        if (role === "expert") {
            socket.emit("joinExpert", { userId });
        }

        return () => {
            socket.off("joinCustomer");
            socket.off("joinExpert");
        };
    }, [userId, role]);

    useEffect(() => {
        if (!userId || !role) return;

        socket.on("newBooking", (data) => {
            if (role === "expert") {
                console.log(data)
                dispatch(addNewService(data.request)); 
            }
            if (role === "customer") {
                dispatch(updateNewBooking(data.request)); 
                toast.success("📢 Successfully Booked!");
            }
        });

        const handleStatusNotification = (status, userType) => {
            const messages = {
                customer: {
                    requested: "📢 Your service request has been submitted!",
                    accepted: "✅ Your booking has been accepted by an expert!",
                    assigned: "📅 An expert has been assigned to your booking!",
                    "in-progress": "⚙️ Your service is in progress!",
                    completed: "🎉 Your service is completed!",
                    approved: "✔️ Your booking is approved!",
                    cancelled: "❌ Your booking was cancelled.",
                },
                expert: {
                    requested: "📢 A new service request is available!",
                    accepted: "✅ You have accepted the booking!",
                    assigned: "📅 You have been assigned to a service!",
                    "in-progress": "⚙️ You have started the service!",
                    completed: "🎉 You have completed the service!",
                    approved: "✔️ Your service completion has been approved!",
                    cancelled: "❌ The booking has been cancelled by the customer.",
                }
            };

            const message = messages[userType]?.[status] || "Booking status updated!";
            toast.info(message);
        };  

        socket.on("bookingStatusUpdated", (data) => {
            console.log("Received status update:", data);
            if (!data?.booking) return;  // Ensure booking data exists

            if (data.userType === "customer") {
                dispatch(customerBookingStatusUpdated(data.booking));
            } else if (data.userType === "expert") {
                dispatch(expertBookingStatusUpdated(data.booking));
            }

            handleStatusNotification(data.booking.status, data.userType);
        });

        socket.on("paymentStatusUpdated", (data) => {
            console.log("Received payment data:", data);
    
            if (data.payment.paymentStatus === "success") {
                toast.success("Booking fee payment succeeded!");
            } else if (data.payment.paymentStatus === "failed") {
                toast.error("Payment failed. Please try again.");
            }
        });

        socket.on("onSiteServiceAdded", (data)=>{
            console.log('onsite data', data)
            if(data.userType === 'customer'){
                dispatch(addOnSiteService({
                    serviceRequestId : data.serviceRequestId,
                    newService : data.newService
                }))
            }
            toast.info("New On Site service added!")
        })

        socket.on("onSiteServiceDeleted", (data) => {
           if(data.userType === 'customer'){
            dispatch(removeOnSiteService(data))
            toast.info("On site service deleted")
           }
           if(data.userType === 'expert'){
            toast.info("On site service deleted")
           }
        })

        return () => {
            socket.off("newBooking");
            socket.off("bookingStatusUpdated"); 
            socket.off("paymentStatusUpdated");
            socket.off("onSiteServiceAdded");
            socket.off("onSiteServiceDeleted");
        };
    }, [userId, role, dispatch]);

    return null;
};

export default NotificationComponent;
