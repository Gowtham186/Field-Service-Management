import React, { useState, lazy, Suspense, useEffect } from "react"
import { useDispatch } from "react-redux";
import { getMyBookings } from "../redux/slices.js/customer-slice";
import Navbar from '../components/Navbar'
const BookingList = lazy(() => import("../components/BookingList"));

export default function MyBookings(){
    const [filter, setFilter] = useState("requested"); 
    const dispatch = useDispatch()

  useEffect(()=>{
        dispatch(getMyBookings())
  },[dispatch])

  return (
    <div>
        <Navbar />
      <div className="flex gap-4 p-4">
        <button
          className={`btn ${filter === "requested" ? "bg-blue-500 text-white" : "bg-gray-200"} p-2`}
          onClick={() => setFilter("requested")}
        >
          Requested
        </button>
        <button
          className={`btn ${filter === "assigned" ? "bg-green-500 text-white" : "bg-gray-200"} p-2`}
          onClick={() => setFilter("assigned")}
        >
          Assigned
        </button>
        <button
          className={`btn ${filter === "rejected" ? "bg-red-500 text-white" : "bg-gray-200"} p-2`}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      <Suspense fallback={<p>Loading bookings...</p>}>
        <BookingList filter={filter} />
      </Suspense>
    </div>
  );
};