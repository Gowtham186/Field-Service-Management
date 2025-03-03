import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookings, setCurrentService  } from "../../redux/slices.js/customer-slice";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { setServiceRequestId } from "../../redux/slices.js/expert-slice";

export default function CustomerCalendar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myBookings } = useSelector((state) => state.customer);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState("assigned");

    useEffect(() => {
        dispatch(getMyBookings());
    }, [dispatch]);

    useEffect(() => {
        if (myBookings) {
            setFilteredBookings(myBookings);
        }
    }, [myBookings]);

    const getStatusClass = (status) => {
        const statusClasses = {
            "completed": "bg-green-400 text-green-700",
            "requested": "bg-yellow-400 text-yellow-700",
            "assigned": "bg-blue-400 text-blue-700",
        };
        return statusClasses[status] || "bg-gray-400 text-gray-700";
    };

    // Filter bookings based on selected status
    useEffect(() => {
        if (filterStatus === "all") {
            setFilteredBookings(myBookings);
        } else {
            setFilteredBookings(myBookings?.filter((booking) => booking.status === filterStatus));
        }
    }, [filterStatus, myBookings]);

    // Convert bookings into events for the calendar
    const events = Array.isArray(filteredBookings)
        ? filteredBookings?.map((booking) => ({
            title: booking.serviceType?.map((type) => type.category.name).join(", "),
            date: booking.scheduleDate, // Ensure correct date format
              allDay: true,
              className: getStatusClass(booking.status),
              bookingDetails: booking,
          }))
        : [];

    const handleViewDetails = (id) => {
        dispatch(setCurrentService(id));
        navigate('/view-service-details');
    };

    const renderEventContent = (eventInfo) => {
        return (
            <div className={`p-2 rounded ${eventInfo.event.className}`}>
                <p className="font-semibold text-black">{eventInfo.event.title}</p>
                {/* <button
                    className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    onClick={() => handleViewDetails(eventInfo.event.extendedProps.bookingDetails._id)}
                >
                    View Details
                </button> */}
            </div>  
        );
    };

    return (
        <>
            <Navbar />
            <h1 className="text-xl font-bold text-center my-4">My Bookings Calendar</h1>

            {/* Filter Dropdown */}
            <div className="flex justify-center my-4">
                <select
                    className="px-3 py-2 border rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="assigned">Scheduled</option>
                    <option value="requested">Requested</option>
                    <option value="completed">Completed</option>
                    <option value="all">All Bookings</option>
                </select>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView={"dayGridMonth"}
                    initialDate={new Date()}
                    selectable={true}
                    events={events}
                    eventContent={renderEventContent}
                />
            </div>
        </>
    );
}
