import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { addNewService, getMyServices, updateBookingStatus } from "../../redux/slices.js/expert-slice";
import { io } from "socket.io-client";

const socket = io("http://localhost:4500"); // Change to your backend URL

export default function NewBookings() {
    const dispatch = useDispatch();
    const { myServices } = useSelector((state) => state.expert);
    const { user } = useSelector((state) => state.user)
    const requestedServices = myServices?.filter(ele => ele.status === 'requested');

    useEffect(() => {
        dispatch(getMyServices());
    
        // const expertId = user?._id;
        // if (expertId) {
        //     console.log(`🔗 Attempting to join expert room: expert-${expertId}`);
        //     socket.emit("joinExpertRoom", `expert-${expertId}`);
        // }
    
        // // Listen for any events
        // socket.onAny((event, ...args) => {
        //     console.log(`📢 Received event: ${event}`, args);
        // });
    
        // socket.on("newBooking", (data, callback) => {
        //     console.log("📢 New booking received:", data);
        
        //     if (!data) {
        //         console.log("⚠️ newBooking event received, but data is undefined!");
        //     } else {
        //         console.log("✅ newBooking received successfully:", JSON.stringify(data, null, 2));
        //     }
        
        //     // Send acknowledgment back to server
        //     if (callback) {
        //         console.log("📩 Sending acknowledgment for newBooking...");
        //         callback({ status: "received", timestamp: new Date().toISOString() });
        //     }
        
        //     // dispatch(getMyServices()); // Refresh expert services list
        //     dispatch(addNewService(data.request))
        // });        
        
    
        // return () => {
        //     socket.off("newBooking");
        // };
    }, [dispatch]);
    

    const handleAction = (id, updateStatus) => {
        const getConfirm = window.confirm("Confirm?");
        if (getConfirm) {
            console.log(updateStatus, 'updating...')
            dispatch(updateBookingStatus({ id, body: { status: updateStatus } }))
                .unwrap()
                .then((response)=> console.log(response.data))
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">New Bookings</h1>
            {requestedServices?.length > 0 ? (
                <div className="space-y-4">
                    {requestedServices.map(service => (
                        <div key={service._id} className="border p-4 rounded-lg shadow-md">
                            {service?.serviceType?.map((servicetype, index) => (
                                <div key={index}>
                                    <p><strong>Category :</strong> {servicetype.category.name}</p>
                                    <p><strong>Services :</strong></p>
                                    {servicetype?.servicesChoosen?.map((ele, idx) => (
                                        <p key={idx}>{ele.serviceName}</p>
                                    ))}
                                </div>
                            ))}

                            <p><strong>Price :</strong> ${service.budget.servicesPrice}</p>
                            <p><strong>Location :</strong> {service.location.address}</p>
                            <p><strong>Schedule Date :</strong> {new Date(service.scheduleDate).toLocaleDateString('en-GB')}</p>

                            <div className="mt-2 flex space-x-2">
                                <button 
                                    onClick={() => handleAction(service._id, "accepted")}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleAction(service._id, "cancelled")}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No new bookings available.</p>
            )}
        </div>
    );
}
