import { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatsCounts, getTotalRevenue } from "../../redux/slices.js/stats-slice";
import { Users, Calendar, Wrench, UserCheck, DollarSign } from "lucide-react";

// Lazy load analytics components
const AnalyticsBookings = lazy(() => import("./AnalyticsBookings"));

export default function DashboardHome() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.stats);

  const [stats, setStats] = useState({
    totalExperts: 0,
    totalBookings: 0,
    totalCategories: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const revenueRes = await dispatch(getTotalRevenue()).unwrap();
        const statsRes = await dispatch(fetchStatsCounts()).unwrap();

        if (isMounted) {
          setStats({
            totalRevenue: revenueRes?.totalRevenue || 0,
            totalBookings: statsRes?.totalBookings || 0,
            totalCategories: statsRes?.totalCategories || 0,
            totalCustomers: statsRes?.totalCustomers || 0,
            totalExperts: statsRes?.totalExperts || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Bookings" value={stats.totalBookings} Icon={Calendar} />
        <StatCard title="Total Experts" value={stats.totalExperts} Icon={Users} />
        <StatCard title="Categories" value={stats.totalCategories} Icon={Wrench} />
        <StatCard title="Customers" value={stats.totalCustomers} Icon={UserCheck} />
        <StatCard title="Total Revenue" value={`₹ ${stats.totalRevenue}`} Icon={DollarSign} />
      </div>

      <Suspense fallback={<p>Loading analytics...</p>}>
        <AnalyticsBookings />
      </Suspense>
    </div>
  );
}

const StatCard = ({ title, value, Icon }) => (
  <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition flex flex-col items-center text-center">
    <Icon className="w-8 h-8 text-orange-500 mb-2" />
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);
