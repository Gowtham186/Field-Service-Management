import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function BookingList({ filter }) {
    const { myBookings } = useSelector((state) => state.customer);
    const [filteredBookings, setFilteredBookings] = useState([]);

    useEffect(() => {
        setFilteredBookings(myBookings?.filter(ele => ele.status === filter));
    }, [filter, myBookings]);

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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
