import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalRevenue } from "../redux/slices.js/stats-slice";
import { Users, Calendar, Wrench, UserCheck, DollarSign, BarChart3, Clock } from "lucide-react";

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

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    dispatch(getTotalRevenue());
  }, [dispatch]);

  useEffect(() => {
    setStats((prevStats) => ({ ...prevStats, totalRevenue }));
  }, [totalRevenue]);

  useEffect(() => {
    // Simulating an API call for recent activities
    setTimeout(() => {
      setRecentActivities([
        { id: 1, message: "New booking confirmed by John Doe", time: "2 mins ago" },
        { id: 2, message: "Expert Alice updated her profile", time: "10 mins ago" },
        { id: 3, message: "Category 'Plumbing' was added", time: "30 mins ago" },
        { id: 4, message: "User Mark registered on the platform", time: "1 hour ago" },
      ]);
    }, 1000);
  }, []);

  if (loading) return <p>...loading</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Experts" value={stats.totalExperts} Icon={Users} />
        <StatCard title="Total Bookings" value={stats.totalBookings} Icon={Calendar} />
        <StatCard title="Categories" value={stats.totalCategories} Icon={Wrench} />
        <StatCard title="Users" value={stats.totalUsers} Icon={UserCheck} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} Icon={DollarSign} />
      </div>

      {/* Recent Activities Section */}
      {/* <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500" /> Recent Activities
        </h3>
        <div className="bg-white shadow p-4 rounded-lg">
          {recentActivities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-2 flex justify-between">
                  <span>{activity.message}</span>
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activities</p>
          )}
        </div>
      </div> */}
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
