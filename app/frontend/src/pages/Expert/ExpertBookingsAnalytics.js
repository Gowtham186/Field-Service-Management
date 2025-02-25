import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpertBookingAnalytics } from "../../redux/slices.js/stats-slice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"; // Import BarChart and Bar
import dayjs from "dayjs";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // For trend icons

export default function ExpertBookingAnalytics() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { expertBookingAnalytics } = useSelector((state) => state.stats);
  
    const [period, setPeriod] = useState("month"); 
  
    useEffect(() => {
      if (user?._id) {
        dispatch(getExpertBookingAnalytics({ id: user?._id, period })); 
      }
    }, [dispatch, user?._id, period]);
  
    console.log("Expert Booking Analytics:", expertBookingAnalytics);
  
    // Function to format raw booking data
    const formatBookings = (bookings) => {
      if (!Array.isArray(bookings)) return [];
  
      // Convert timestamps to formatted dates
      const formattedData = bookings.map((booking) => ({
        date: dayjs(booking.timestamp).format("YYYY-MM-DD"),
        bookings: 1, 
      }));
  
      // Aggregate bookings by date
      const aggregatedData = formattedData.reduce((acc, curr) => {
        const existingEntry = acc.find((item) => item.date === curr.date);
        if (existingEntry) {
          existingEntry.bookings += 1;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, []);
  
      return aggregatedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    };
  
    const bookingTrends = formatBookings(expertBookingAnalytics?.bookings || []);
    
    // Data for bookings by category
    const categoryData = expertBookingAnalytics?.bookingsByCategory
      ? Object.entries(expertBookingAnalytics?.bookingsByCategory).map(([category, count]) => ({
          category,
          bookings: count,
        }))
      : [];
  
    return (
      <>
        <div className="flex gap-2">
          <div className="w-1/4 p-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Total Bookings</h2>
              <p className="text-2xl font-bold text-blue-600">{expertBookingAnalytics?.totalBookings || 0}</p>
            </div>
  
            <div className="my-4"></div>
  
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Growth & Dynamic Bookings</h2>
              <div className="mt-2">
                <p className="text-2xl font-bold text-blue-600">{expertBookingAnalytics?.currentBookings || 0}</p>
                <div className="flex items-center">
                  {expertBookingAnalytics?.growthDirection === "up" ? (
                    <FaArrowUp className="text-green-500 mr-2" />
                  ) : expertBookingAnalytics?.growthDirection === "down" ? (
                    <FaArrowDown className="text-red-500 mr-2" />
                  ) : (
                    <span className="text-gray-500 mr-2">→</span>
                  )}
                  <span className="text-sm text-gray-500">
                    {expertBookingAnalytics?.growth > 0
                      ? `+${expertBookingAnalytics?.growth.toFixed(2)}%`
                      : expertBookingAnalytics?.growth < 0
                      ? `${expertBookingAnalytics?.growth.toFixed(2)}%`
                      : "No Change"}
                  </span>
                </div>
                <div className="mt-2 w-full h-2 bg-gray-200 rounded-full relative">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(Math.abs(expertBookingAnalytics?.growth || 0), 100)}%`,
                      backgroundColor: expertBookingAnalytics?.growth > 0 ? "green" : "red",
                      transition: "width 0.3s ease-in-out",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex-1 bg-white py-3 px-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Booking Trends</h2>
            <div className="flex gap-4 mb-2">
              {["day", "week", "month", "year"].map((f) => (
                <button
                  key={f}
                  onClick={() => setPeriod(f)}
                  className={`px-2 py-1 text-sm rounded ${period === f ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {bookingTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No booking trends available.</p>
            )}
          </div>
        </div>
  
        <div className="mt-4">
          <div className="bg-white py-3 px-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Bookings by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="2 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8884d8" barSize={40} />
                  </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No bookings by category available.</p>
            )}
          </div>
        </div>
      </>
    );
  }
  
