import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExperts } from "../redux/slices.js/expert-slice";

export default function ManageExperts() {
    const { experts } = useSelector((state) => state.expert);
    
    const dispatch = useDispatch()
    const [search, setSearch] = useState("")
    const [skill, setSkill] = useState("")
    const [verified, setVerified] = useState("")
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    useEffect(()=>{
        dispatch(getAllExperts({ search, skill, verified, page, limit}))
    },[dispatch, search, skill, verified, page, limit])
    
    return (
        <>
            <h1>Manage Experts</h1>
            <div className="flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search Expert"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <input
                    type="text"
                    placeholder="Filter by Skill"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <select
                    value={verified}
                    onChange={(e) => setVerified(e.target.value)}
                    className="border p-2 rounded flex-1"
                >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                </select>
            </div>
            <table className="table-auto mt-2 w-full border-collapse border border-gray-200">
                <thead className="bg-red-300">
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Age</th>
                        <th className="border px-4 py-2">Gender</th>
                        <th className="border px-4 py-2">Experience</th>
                        <th className="border px-4 py-2">Skills</th>
                        <th className="border px-4 py-2">Location</th>
                        <th className="border px-4 py-2">Verification Status</th>
                    </tr>
                </thead>
                <tbody>
                    {experts && experts?.data?.length > 0 ? (
                        experts?.data?.map((expert) => (
                            <tr key={expert?._id} className="border-b hover:bg-gray-50">
                                <td className="border px-6 py-3 text-gray-700">{expert.expert.name}</td>
                                <td className="border px-6 py-3 text-gray-700">{expert.age}</td>
                                <td className="border px-6 py-3 text-gray-700 capitalize">{expert.gender}</td>
                                <td className="border px-6 py-3 text-gray-700">{expert.experience} years</td>
                                <td className="border px-6 py-3 text-gray-700">
                                    {expert.skills?.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {expert.skills.map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">No skills</span>
                                    )}
                                </td>
                                <td className="border px-6 py-3 text-gray-700">{expert.location?.address || 'Not available'}</td>
                                <td className="p-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        expert.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700" }`}>
                                        {expert.isVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </td>
                            </tr>
                        ))
                            ) : (
                            <tr>
                                <td colSpan="7" className="border px-4 py-2 text-center">No experts available</td>
                            </tr>
                    )}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-2">
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
                    <span className="px-4 py-2 text-gray-800">Page {experts?.currentPage} of {experts?.totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, experts?.totalPages))}
                        disabled={page === experts?.totalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
