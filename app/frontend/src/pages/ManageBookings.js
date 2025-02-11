import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServiceRequests } from "../redux/slices.js/service-request-slice";

export default function ManageBookings() {
    const dispatch = useDispatch();
    const { allServiceRequests, loading } = useSelector((state) => state.serviceRequest);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        dispatch(getAllServiceRequests({ search, status, category, sort, page, limit }));
    }, [dispatch, search, status, category, sort, page, limit]);

    if (loading) {
        return <p className="text-center text-gray-500">...fetching</p>;
    }

    return (
        <div >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Bookings</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <input
                    type="text"
                    placeholder="Search Customer/Expert"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded flex-1"
                >
                    <option value="">All Status</option>
                    <option value="requested">Requested</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter by Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border p-2 rounded flex-1"
                >
                    <option value="">Sort by Price</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>

            {allServiceRequests?.data?.length === 0 ? (
                <p className="text-gray-500 text-center">No service requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr className="text-left">
                                <th className="p-3">#</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Expert</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Service Price</th>
                                <th className="p-3">Scheduled Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allServiceRequests?.data?.map((request, index) => (
                                <tr key={request?._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{(page - 1) * limit + index + 1}</td>
                                    <td className="p-3">{request.customer?.name || "N/A"}</td>
                                    <td className="p-3">{request.expert?.name || "N/A"}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            request.status === "completed" ? "bg-green-100 text-green-700" :
                                            request.status === "in-progress" ? "bg-yellow-100 text-yellow-700" :
                                            request.status === "requested" ? "bg-gray-100 text-gray-700" : 
                                            request.status === "assigned" ? "bg-indigo-100 text-indigo-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {request?.categoryDetails?.map(category => (
                                            <span key={category._id} className="block text-center bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md mb-1">
                                                {category.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="p-3 text-center text-gray-800 font-semibold">₹{request?.budget?.finalPrice || "N/A"}</td>
                                    <td className="p-3">{new Date(request.scheduleDate).toLocaleDateString("en-GB")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                {/* Limit Selection */}
                <div>
                    <label className="text-gray-700 mr-2">Show</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="border p-2 rounded"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                {/* Pagination Buttons */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-800">Page {allServiceRequests?.currentPage} of {allServiceRequests?.totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, allServiceRequests?.totalPages))}
                        disabled={page === allServiceRequests?.totalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
