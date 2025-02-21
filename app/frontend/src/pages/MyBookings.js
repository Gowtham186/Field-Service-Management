import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyBookings, setCurrentService } from "../redux/slices.js/customer-slice";
import Navbar from "../components/Navbar";
import { payBookingFee } from "../redux/slices.js/service-request-slice";
import { toast } from "react-toastify";

export default function MyBookings() {
  const [filter, setFilter] = useState("scheduledToday"); // Default filter
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myBookings  = useSelector((state) => state.customer.myBookings);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch, filter]);

  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  useEffect(() => {
    console.log("Updated Bookings:", myBookings);
}, [myBookings]);


  // Filter scheduled today
  const scheduledTodayBookings = myBookings?.filter((booking) => {
    const serviceDate = new Date(booking.scheduleDate);
    return (booking.status === "in-progress" || booking.status === "assigned") && isToday(serviceDate);
  });
  console.log("Scheduled Today Bookings:", scheduledTodayBookings);

  const filteredBookings = myBookings ? myBookings.filter((booking) => {
    if (filter === "scheduledToday") {
        return scheduledTodayBookings.some((b) => b._id === booking._id);
    }
    return filter === "in-progress"
        ? ["in-progress", "assigned"].includes(booking.status)
        : booking.status === filter;
}) : [];

  const handleServiceProgress = (booking) => {
    // localStorage.setItem("serviceId", booking._id);
    dispatch(setCurrentService(booking));
    navigate(`/track-work/${booking?._id}`);
  };

  const makePayment = async (booking) => {
    try {
      const body = {
        serviceRequestId: booking?._id,
        amount: booking?.budget.bookingFee,
      };
      const response = await dispatch(payBookingFee(body)).unwrap();

      if (!response || !response.url) {
        toast.error("Payment processing failed.");
        return;
      }

      window.location.href = response.url; // Redirect to Stripe
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <div>
      <Navbar />

      {/* Filter Buttons */}
      <div className="flex gap-4 p-4">
        {scheduledTodayBookings?.length > 0 && (
          <button
            className={`btn ${filter === "scheduledToday" ? "bg-blue-500 text-white" : "bg-gray-200"} p-2`}
            onClick={() => setFilter("scheduledToday")}
          >
            Scheduled Today
          </button>
        )}
        {["accepted", "requested", "assigned"].map((status) => (
          <button
            key={status}
            className={`btn ${filter === status ? "bg-blue-500 text-white" : "bg-gray-200"} p-2`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Display filtered bookings */}
      <div className="p-4">
        {filteredBookings?.length === 0 ? (
          <p>No {filter} bookings found</p>
        ) : (
          <ul className="space-y-4">
            {filteredBookings?.map((booking) => (
              <li key={booking._id} className="border p-4 rounded-lg shadow-md">
                <p><strong>Id:</strong> {booking._id}</p>
                {booking?.serviceType?.map((servicetype, index) => (
                  <div key={index}>
                    <p><strong>Category:</strong> {servicetype.category.name}</p>
                    <p><strong>Services:</strong></p>
                    {servicetype?.servicesChoosen?.map((ele, idx) => (
                      <p key={idx}>{ele.serviceName}</p>
                    ))}
                  </div>
                ))}
                <p><strong>Expert:</strong> {booking.expertId?.name || "Not Assigned"}</p>
                <p><strong>Location:</strong> {booking.location?.address}</p>
                <p><strong>Price:</strong> ₹{booking.budget?.servicesPrice || 0}</p>
                <p><strong>Schedule Date:</strong> {new Date(booking.scheduleDate).toLocaleDateString("en-GB")}</p>
                <p><strong>Coordinates:</strong> lat: {booking.location?.coords.lat}, lng: {booking.location?.coords.lng}</p>

                {/* Payment and Tracking Options */}
                {booking.status === "accepted" && (
                  <button
                    className="bg-green-500 text-white p-2 mt-2 rounded"
                    onClick={() => makePayment(booking)}
                  >
                    Pay Booking Fee
                  </button>                
                )}

                  {/* {["in-progress", "scheduledToday"].includes(filter) && booking.expertId?._id && booking.status === "in-progress" && (                   <>
                    <button
                      className="bg-blue-500 text-white p-2 mt-2 rounded"
                      onClick={() =>
                        navigate(`/track-expert/${booking.expertId._id}`, {
                          state: {
                            serviceAddress: booking.location?.address,
                            serviceCoords: {
                              latitude: booking.location?.coords.lat,
                              longitude: booking.location?.coords.lng,
                            },
                          },
                        })
                      }
                    >
                      Track Expert
                    </button>
                    <button
                      className="bg-blue-500 text-white p-2 ml-3 mt-2 rounded"
                      onClick={() => handleServiceProgress(booking)}
                    >
                      Track Work
                    </button>
                  </>
                )} */}

                {["in-progress", "scheduledToday", "assigned"].includes(booking.status) && (
                  <>
                    <button
                      className="bg-blue-500 text-white p-2 mt-2 rounded"
                      onClick={() =>
                        navigate(`/track-expert/${booking.expertId._id}`, {
                          state: {
                            serviceAddress: booking.location?.address,
                            serviceCoords: {
                              latitude: booking.location?.coords.lat,
                              longitude: booking.location?.coords.lng,
                            },
                          },
                        })
                      }
                    >
                      Track Expert
                    </button>
                    <button
                      className="bg-blue-500 text-white p-2 ml-3 mt-2 rounded"
                      onClick={() => handleServiceProgress(booking)}
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
    </div>
  );
}
