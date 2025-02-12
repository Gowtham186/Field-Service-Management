import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalExperts: 0,
    totalBookings: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await axios.get("http://localhost:3030/api/admin/stats");
//         setStats(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//       }
//     };
//     fetchStats();
//   }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome, Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="📌 Total Experts" value={stats.totalExperts} />
        <StatCard title="📅 Total Bookings" value={stats.totalBookings} />
        <StatCard title="🛠️ Categories" value={stats.totalCategories} />
        <StatCard title="👥 Users" value={stats.totalUsers} />
      </div>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl mt-2">{value}</p>
  </div>
);
