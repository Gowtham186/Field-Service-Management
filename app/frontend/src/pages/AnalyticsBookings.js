import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminBookingsAnalytics } from "../redux/slices.js/stats-slice";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,  // ✅ Register the missing scale
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,  // ✅ Needed for Bar Charts
} from "chart.js";

// ✅ Register all required components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement
);

export default function AnalyticsBookings() {
  const dispatch = useDispatch();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await dispatch(fetchAdminBookingsAnalytics()).unwrap();
        setAnalytics(response);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    }
    fetchAnalytics();
  }, [dispatch]);

  if (!analytics) return <p>Loading...</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold">Admin Booking Analytics</h3>

      <p>Total Bookings: {analytics.totalBookings}</p>
      <p>Bookings This Period: {analytics.currentBookings}</p>
      <p>Bookings Last Period: {analytics.previousBookings}</p>
      <p>Growth: {analytics.growth}%</p>

      <h4>Bookings by Category</h4>
      <ul>
        {Object.entries(analytics.bookingsByCategory).map(([category, count]) => (
          <li key={category}>{category}: {count} bookings</li>
        ))}
      </ul>

      <h4>Bookings Trend</h4>
      <Line
        data={{
          labels: analytics.bookings.map((b) => new Date(b).toLocaleDateString()),
          datasets: [{ label: "Bookings", data: analytics.bookings.map(() => 1) }],
        }}
      />
    </div>
  );
}
