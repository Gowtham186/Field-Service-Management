import { useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ExpertRevenueByCategory() {
    const { expertRevenue } = useSelector((state) => state.stats);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    // Ensure `categoriesRevenue` exists before mapping
    const data = expertRevenue?.categoriesRevenue
        ? Object.entries(expertRevenue.categoriesRevenue).map(([category, amount]) => ({
            name: category,
            value: amount
        }))
        : [];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow flex gap-6">
            {/* Left - Pie Chart */}
            <div className="w-1/2">
                <h2 className="text-lg font-semibold mb-4">Revenue by Category</h2>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                                onMouseEnter={(entry) => setHoveredCategory(entry.name)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500">No category revenue data available.</p>
                )}
            </div>

            {/* Right - Hover Details & Series List */}
            <div className="w-1/2">
                {/* Series List */}
                <div className="space-y-2 mb-2">
                    <h3 className="text-lg font-semibold">Series</h3>
                    <ul className="space-y-1 mb-2">
                        {data.map((entry, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></span>
                                <span>{entry.name}: ₹{entry.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Hover Details */}
                {hoveredCategory ? (
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600">{hoveredCategory}</h3>
                        <p className="text-gray-600">
                            Revenue: ₹{data.find((item) => item.name === hoveredCategory)?.value}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 mb-4">Hover over a category to see details.</p>
                )}

                
            </div>
        </div>
    );
}
