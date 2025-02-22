import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatsCounts, getTotalRevenue } from "../redux/slices.js/stats-slice";
import { Users, Calendar, Wrench, UserCheck, DollarSign, BarChart3 } from "lucide-react";
import AnalyticsBookings from "./AnalyticsBookings";

export default function DashboardHome() {
  const { loading } = useSelector((state) => state.stats);
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    totalExperts: 0,
    totalBookings: 0,
    totalCategories: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  const [selectedAnalytics, setSelectedAnalytics] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const revenueRes = await dispatch(getTotalRevenue()).unwrap();
        const statsRes = await dispatch(fetchStatsCounts()).unwrap();

        setStats({
          totalRevenue: revenueRes?.totalRevenue,
          totalBookings: statsRes?.totalBookings,
          totalCategories: statsRes?.totalCategories,
          totalCustomers: statsRes?.totalCustomers,
          totalExperts: statsRes?.totalExperts,
        });
      } catch (err) {
        console.log("Error fetching stats", err);
      }
    }
    fetchStats();
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Bookings" value={stats.totalBookings} Icon={Calendar} onClick={() => setSelectedAnalytics("bookings")} />
        <StatCard title="Total Experts" value={stats.totalExperts} Icon={Users} onClick={() => setSelectedAnalytics("experts")} />
        <StatCard title="Categories" value={stats.totalCategories} Icon={Wrench} onClick={() => setSelectedAnalytics("categories")} />
        <StatCard title="Customers" value={stats.totalCustomers} Icon={UserCheck} onClick={() => setSelectedAnalytics("customers")} />
        <StatCard title="Total Revenue" value={`₹ ${stats.totalRevenue}`} Icon={DollarSign} onClick={() => setSelectedAnalytics("revenue")} />
      </div>

      {/* Show Analytics below */}
      {selectedAnalytics === "bookings" && <AnalyticsBookings />}
    </div>
  );
}

// Fix: Ensure onClick is used in the button inside StatCard
const StatCard = ({ title, value, Icon, onClick }) => (
  <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition flex flex-col items-center text-center">
    <Icon className="w-8 h-8 text-orange-500 mb-2" />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <button
      className="mt-3 px-4 py-1 text-sm text-white bg-orange-300 rounded-md flex items-center gap-2 hover:bg-orange-400"
      onClick={onClick} // Fix: Use onClick in button
    >
      <BarChart3 className="w-4 h-4" />
      View Analytics
    </button>
  </div>
);
