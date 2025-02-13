import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { setCurrentService } from "../redux/slices.js/customer-slice";

export default function BookingList({ filter }) {
    const { myBookings } = useSelector((state) => state.customer);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const navigate = useNavigate(); 
    const dispatch = useDispatch()

    useEffect(() => {
        if (filter === "scheduledToday") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const scheduledToday = myBookings?.filter(service => {
                const isValidStatus = service.status === "assigned" || service.status === "in-progress";
                if (!isValidStatus) return false;

                const serviceDate = new Date(service.scheduleDate);
                serviceDate.setHours(0, 0, 0, 0);

                return serviceDate.getTime() === today.getTime();
            });

            setFilteredBookings(scheduledToday);
        } else {
            setFilteredBookings(myBookings?.filter(ele => ele.status === filter));
        }
    }, [filter, myBookings]);

    const handleServiceProgress = (bookingId)=>{
        navigate(`/track-work/${bookingId._id}`)
        dispatch(setCurrentService(bookingId))
    }

    return (
        <div className="p-4">
            {filteredBookings?.length === 0 ? (
                <p>No {filter} bookings found</p>
            ) : (
                <ul className="space-y-4">
                    {filteredBookings?.map((booking) => (
                        <li key={booking._id} className="border p-4 rounded-lg shadow-md">
                           {booking?.serviceType?.map((servicetype, index) => (
                                <div key={index}>
                                    <p><strong>Category :</strong> {servicetype.category.name}</p>
                                    <p><strong>Services :</strong></p>
                                    {servicetype?.servicesChoosen?.map((ele, idx) => (
                                        <p key={idx}>{ele.serviceName}</p>
                                    ))}
                                </div>
                            ))}
                            <p><strong>Expert : </strong> {booking.expertId?.name || "Not Assigned"}</p>
                            <p><strong>Location : </strong> {booking.location?.address}</p>
                            <p><strong>Price : </strong> ₹{booking.budget?.servicesPrice || 0}</p>
                            <p><strong>Schedule Date : </strong> {new Date(booking.scheduleDate).toLocaleDateString("en-GB")}</p>
                            <p><strong>Coordinates:</strong> lat: {booking.location?.coords.lat}, lng: {booking.location?.coords.lng}</p>

                            {/* Show Track Expert Button if Assigned and Scheduled Today */}
                            {(filter === "scheduledToday" || booking.status === "in-progress") && booking.expertId?._id && (
                                <>
                                <button
                                    className="bg-blue-500 text-white p-2 mt-2 rounded"
                                    onClick={() => {
                                        navigate(`/track-expert/${booking.expertId._id}`, {
                                            state: {
                                                serviceAddress: booking.location?.address,
                                                serviceCoords: {
                                                    latitude: booking.location?.coords.lat,
                                                    longitude: booking.location?.coords.lng
                                                }
                                            }
                                        });
                                    }}
                                >
                                    Track Expert
                                </button>
                                    <button
                                        className="bg-blue-500 text-white p-2 ml-3 mt-2 rounded"
                                        onClick={()=> handleServiceProgress(booking) }
                                        
                                        >
                                        Track Work
                                        </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
