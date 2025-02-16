import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalRevenue } from "../redux/slices.js/stats-slice";
import { Users, Calendar, Wrench, UserCheck, DollarSign, BarChart3 } from "lucide-react";

export default function DashboardHome() {
  const { totalRevenue, loading } = useSelector((state) => state.stats);
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    totalExperts: 0,
    totalBookings: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    dispatch(getTotalRevenue());
  }, [dispatch]);

  useEffect(() => {
    setStats((prevStats) => ({ ...prevStats, totalRevenue }));
  }, [totalRevenue]);

  if (loading) return <p>...loading</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome, Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Experts" value={stats.totalExperts} Icon={Users} />
        <StatCard title="Total Bookings" value={stats.totalBookings} Icon={Calendar} />
        <StatCard title="Categories" value={stats.totalCategories} Icon={Wrench} />
        <StatCard title="Users" value={stats.totalUsers} Icon={UserCheck} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} Icon={DollarSign} />
      </div>
    </div>
  );
}

const StatCard = ({ title, value, Icon }) => (
  <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition flex flex-col items-center text-center">
    <Icon className="w-8 h-8 text-orange-500 mb-2" />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <button className="mt-3 px-4 py-1 text-sm text-white bg-orange-300 rounded-md flex items-center gap-2 hover:bg-orange-400">
      <BarChart3 className="w-4 h-4" />
      View Analytics
    </button>
  </div>
);
