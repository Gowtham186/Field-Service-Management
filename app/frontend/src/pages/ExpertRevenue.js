import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpertRevenue } from "../redux/slices.js/expert-slice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ExpertRevenue() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { revenue } = useSelector((state) => state.expert);
    const [filter, setFilter] = useState("month");

    useEffect(() => {
        if (user?._id) dispatch(getExpertRevenue(user._id));
    }, [dispatch, user?._id]);

    // ✅ Group revenue by selected filter using expertAmount
    const filteredRevenue = useMemo(() => {
        if (!revenue?.payments) return [];

        const grouped = revenue.payments.reduce((acc, payment) => {
            const date = new Date(payment.createdAt);
            let key =
                filter === "day" ? date.toLocaleDateString("en-CA") :
                filter === "week" ? new Date(date.setDate(date.getDate() - date.getDay())).toLocaleDateString("en-CA") :
                filter === "month" ? date.toLocaleString("en-US", { month: "short", year: "numeric" }) :
                date.getFullYear().toString();

            acc[key] = (acc[key] || 0) + payment.expertAmount;  // ✅ Ensure using expertAmount
            return acc;
        }, {});

        return Object.entries(grouped).map(([time, amount]) => ({ time, amount }));
    }, [revenue?.payments, filter]);

    return (
        <div className="flex gap-6">
            {/* Left Side - Total Revenue */}
            <div className="w-1/4 bg-white p-6 rounded-lg shadow items-center align-middle">
                <h2 className="text-lg font-semibold">Total Revenue</h2>
                <p className="text-2xl font-bold text-blue-600">₹{revenue?.totalRevenue}</p>
            </div>

            {/* Right Side - Filters & Chart */}
            <div className="w-3/4 bg-white p-6 rounded-lg shadow space-y-6">
                {/* Filter Buttons */}
                <div className="flex gap-2">
                    {["day", "week", "month", "year"].map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Revenue Chart */}
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={filteredRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
