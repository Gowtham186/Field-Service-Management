import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUnverifiedExperts, toggledIsVerified } from "../../redux/slices.js/expert-slice";

export default function VerifyExperts() {
    const dispatch = useDispatch();
    const { unVerifiedExperts } = useSelector((state) => state.expert);
    const [experts, setExperts] = useState([]);

    useEffect(() => {
        dispatch(getUnverifiedExperts()).unwrap().then((data) => {
            setExperts(data); // Set local state
        });
    }, [dispatch]);

    const handleVerify = async (expert) => {
        const updateVerify = !expert.isVerified;
        const getConfirm = window.confirm("Are you sure?");
        if (getConfirm) {
            await dispatch(toggledIsVerified({ id: expert?.userId?._id, body: { isVerified: updateVerify } })).unwrap();
            
            // Update local state immediately
            setExperts((prevExperts) => prevExperts.filter((e) => e._id !== expert._id));
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold mb-4">Verify Experts</h1>
            {experts.length === 0 ? (
                <p>No unverified experts found</p>
            ) : (
                <div>
                    {experts.map((expert) => (
                        <div key={expert._id} className="w-full p-4 border shadow-md rounded-md mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Name: {expert.userId?.name}</h2>
                                    <p className="text-md mb-1"><span className="text-gray-700">Age:</span> {expert.age}</p>
                                    <p className="mb-1 text-md">Gender: {expert.gender}</p>
                                    <p className="mb-1 text-md">Location: {expert.location.address}</p>
                                    <p className="mb-1 text-md">Experience: {expert.experience}</p>
                                    <h2 className="text-lg font-medium">Skills:</h2>
                                    {expert.skills?.map((category, index) => (
                                        <span key={index}>{category.name} </span>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-lg font-medium mb-2">Documents:</h2>
                                    {expert.documents?.map((doc, index) => (
                                        <p key={index} className="text-sm text-gray-600">
                                            <a
                                                href={doc.pathName}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {doc.type}
                                            </a>
                                        </p>
                                    ))}
                                    <button className="py-2 px-4 mt-32 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 max-w-xs"
                                        onClick={() => handleVerify(expert)}
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}