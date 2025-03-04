import { useSelector } from "react-redux";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ExpertAvgBookingValueChart() {
  const { expertRevenue } = useSelector((state) => state.stats);

  // Calculate average booking value
  const avgBookingValue =
        expertRevenue?.totalBookings > 0
      ? expertRevenue?.totalRevenue /expertRevenue?.totalBookings
      : 0;

  const data = [
    {
      name: "Expert",
      avgBookingValue: avgBookingValue,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Average Booking Value</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="avgBookingValue"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.5} 
            strokeWidth={2}  
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-2xl font-bold text-blue-600 mt-2">
        {avgBookingValue > 0 ? avgBookingValue.toFixed(2) : "No Data"}
      </p>
    </div>
  );
}
