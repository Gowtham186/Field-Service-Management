import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExperts } from "../redux/slices.js/expert-slice";

export default function ManageExperts() {
    const { experts } = useSelector((state) => state.expert);
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getAllExperts())
    },[dispatch])

    return (
        <>
            <h1>Manage Experts</h1>
            <table className="table-auto mt-3 w-full border-collapse border border-gray-200">
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
                    {experts && experts.length > 0 ? (
                        experts.map((expert) => (
                            <tr key={expert._id}>
                                <td className="border px-4 py-2">{expert.userId.name}</td>
                                <td className="border px-4 py-2">{expert.age}</td>
                                <td className="border px-4 py-2">{expert.gender}</td>
                                <td className="border px-4 py-2">{expert.experience} years</td>
                                <td className="border px-4 py-2">
                                    {expert.skills && expert.skills.length > 0 ? expert.skills.map(skill => skill.name).join(', ') : 'No skills'}
                                </td>
                                <td className="border px-4 py-2">{expert.location?.address || 'Not available'}</td>
                                <td className="border px-4 py-2">
                                    {expert.isVerified ? 'Verified' : 'Not Verified'}
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
        </>
    );
}
