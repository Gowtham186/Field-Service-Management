import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyServices } from "../redux/slices.js/expert-slice";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ExpertHistory() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { myServices } = useSelector((state) => state.expert);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    if (id) {
      dispatch(getMyServices());
    }
  }, [dispatch, id]);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Service Request History</h1>

      {myServices?.length === 0 ? (
        <p className="text-gray-500 text-center bg-white p-4 rounded-lg shadow">
          No service requests found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="text-gray-800 bg-gray-100">
              <tr className="text-left">
                <th className="p-4">#</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Category</th>
                <th className="p-4">Service Price</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myServices?.map((request, index) => (
                <tr key={request?._id} className="border-t hover:bg-gray-100 transition">
                  <td className="p-4">{(page - 1) * limit + index + 1}</td>
                  <td className="p-4">{request.customerId?.name || "N/A"}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        request.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : request.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "requested"
                          ? "bg-gray-100 text-gray-700"
                          : request.status === "assigned"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {request?.serviceType?.map((service) => (
                      <span key={service?.category?.name} className="block text-center bg-blue-100 text-blue-700 text-xs font-semibold py-1 rounded-md mb-1">
                        {service?.category?.name}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-center text-gray-800 font-semibold">₹{request?.budget?.servicesPrice || "N/A"}</td>
                  <td className="p-4">{new Date(request.scheduleDate).toLocaleDateString("en-GB")}</td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/service-details/${request?._id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
