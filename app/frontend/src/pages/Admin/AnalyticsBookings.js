import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminBookingsAnalytics, fetchRevenueAnalytics } from "../../redux/slices.js/stats-slice";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, ArcElement, LinearScale, BarElement, Tooltip, Legend);

export default function AnalyticsBookings() {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("month");

  const { allBookingAnalytics, revenueAnalytics, loading } = useSelector((state) => state.stats);

  useEffect(() => {
    if (!allBookingAnalytics) {
      dispatch(fetchAdminBookingsAnalytics({ period }));
    }
  }, [dispatch, period, allBookingAnalytics]);
  
  useEffect(() => {
    if (!revenueAnalytics) {
      dispatch(fetchRevenueAnalytics());
    }
  }, [dispatch, revenueAnalytics]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  const revenueBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const bookingPieData = {
    labels: Object.keys(allBookingAnalytics?.bookingsByCategory || {}),
    datasets: [
      {
        label: "Bookings by Category",
        data: Object.values(allBookingAnalytics?.bookingsByCategory || {}),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#FF9F40"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const revenuePieData = {
    labels: Object.keys(revenueAnalytics?.revenueByCategory || {}),
    datasets: [
      {
        label: "Revenue by Category",
        data: Object.values(revenueAnalytics?.revenueByCategory || {}),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#FF9F40"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const revenueBarData = {
    labels: ["Booking Fee", "Service Fee"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [
          revenueAnalytics?.totalBookingFee || 0,  // Fetching Booking Fee
          revenueAnalytics?.totalServiceFee || 0   // Fetching Service Fee
        ],
        backgroundColor: ["#4CAF50", "#36A2EB"], // Different colors for clarity
        borderColor: "#333",
        borderWidth: 1,
      },
    ],
  };  

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto mt-4">
      {/* Pie Charts in One Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Bookings by Category</h4>
          <div className="max-w-xs">
            <Pie data={bookingPieData} options={pieChartOptions} />
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Category</h4>
          <div className="max-w-xs">
            <Pie data={revenuePieData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Revenue Bar Chart */}
      <div className="mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Fee</h4>
        <div className="max-w-lg mx-auto">
          <Bar data={revenueBarData} options={revenueBarOptions} />
        </div>
      </div>
    </div>
  );
}
