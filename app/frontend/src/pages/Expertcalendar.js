import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyServices, setServiceRequestId } from "../redux/slices.js/expert-slice";
import { useNavigate } from "react-router-dom";

export default function ExpertCalendar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myServices } = useSelector((state) => state.expert);
    const [assignedServices, setAssignedServices] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all"); // Default filter

    useEffect(() => {
        dispatch(getMyServices());
    }, [dispatch]);

    useEffect(() => {
        if (myServices) {
            setAssignedServices(myServices);
        }
    }, [myServices]);

    const getStatusClass = (status) => {
        const statusClasses = {
            "completed": "bg-green-400 text-green-700",
            "in-progress": "bg-indigo-400 text-indigo-700",
            "requested": "bg-gray-400 text-gray-700",
            "assigned": "bg-yellow-400 text-yellow-700",
        };
        return statusClasses[status] || "bg-red-400 text-red-700";
    };

    // Filter events based on selected status
    const filteredServices =
        filterStatus === "all"
            ? assignedServices
            : assignedServices.filter((ele) => ele.status === filterStatus);

    const events = Array.isArray(myServices)
        ? filteredServices?.map((ele) => ({
              title: ele.serviceType?.map((type) => type.category.name).join(", "),
              date: ele.scheduleDate,
              allDay: true,
              className: getStatusClass(ele.status), // Apply dynamic class
              serviceDetails: ele,
          }))
        : [];

    const handleViewDetails = (id) => {
        dispatch(setServiceRequestId(id));
        navigate("/service-details");
    };

    const renderEventContent = (eventInfo) => {
        return (
            <div className={`p-2 rounded ${eventInfo.event.className}`}>
                <p className="font-semibold text-black">{eventInfo.event.title}</p>
                <button
                    className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    onClick={() => handleViewDetails(eventInfo.event.extendedProps.serviceDetails._id)}
                >
                    View Details
                </button>
            </div>
        );
    };

    return (
        <>
            <h1 className="text-xl font-bold text-center my-4">My Calendar</h1>

            {/* Filter Dropdown */}
            <div className="flex justify-center my-4">
                <select
                    className="px-3 py-2 border rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Services</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="assigned">Assigned</option>
                    <option value="rejected">Rejected</option>
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
