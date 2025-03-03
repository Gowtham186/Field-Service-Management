import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyServices } from "../../redux/slices.js/expert-slice";
import OngoingService from "../../components/OngoingService";
import { Users, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getExpertBookingAnalytics, getExpertRevenue } from "../../redux/slices.js/stats-slice";

export default function ExpertDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const { expertBookingAnalytics, expertRevenue } = useSelector((state) => state.stats);

    const [expertStats, setExpertStats] = useState({
        totalBookings: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        dispatch(getMyServices());
    }, [dispatch]);

    useEffect(() => {
        if (user?._id) {
            (async () => {
                try {
                    let bookings = expertBookingAnalytics;
                    let revenue = expertRevenue;

                    if (bookings.totalBookings === 0) {
                        bookings = await dispatch(getExpertBookingAnalytics({ id: user?._id, period: "" })).unwrap();
                        console.log(bookings)
                    }
                    if (revenue.totalRevenue === 0) {
                        revenue = await dispatch(getExpertRevenue(user?._id)).unwrap();
                        console.log(revenue)
                    }

                    setExpertStats({
                        totalBookings: bookings?.totalBookings || 0,
                        totalRevenue: revenue?.totalRevenue || 0
                    });
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [dispatch, user?._id]);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-3">
                <StatCard title="Total Bookings" value={expertStats.totalBookings} Icon={Calendar} onClick={() => navigate('/experts/bookings-analytics')} />
                <StatCard title="Total Revenue" value={`₹ ${expertStats.totalRevenue}`} Icon={DollarSign} onClick={() => navigate('/experts/revenue')} />
            </div>
            <div>
                <OngoingService />
            </div>
            {/* <div>
                <UpcomingService />
            </div> */}
        </>
    );
}

const StatCard = ({ title, value, Icon, onClick }) => (
    <div className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition flex flex-col items-center text-center">
        <Icon className="w-8 h-8 text-orange-500 mb-2" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <button
            className="mt-3 px-4 py-1 text-sm text-white bg-orange-400 rounded-md flex items-center gap-2 hover:bg-orange-500"
            onClick={onClick}
        >
            <BarChart3 className="w-4 h-4" />
            View Analytics
        </button>
    </div>
);
