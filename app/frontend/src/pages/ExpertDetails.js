import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExpertProfile } from "../redux/slices.js/expert-slice";

export default function ExpertDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { profile } = useSelector((state) => state.expert);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getExpertProfile(id));
  }, [dispatch, id]);

  const handleBookExpert = (id) => {
    navigate(`/experts/${id}/categories`);
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col justify-center items-center p-8">
      {/* Profile Section */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg flex items-center space-x-8 p-8">
        {/* Profile Picture */}
        <div className="w-40 h-40">
          <img
            src={profile?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        {/* Expert Details */}
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">{profile?.userId?.name}</h1>
          <p><span className="font-semibold">Age:</span> {profile?.age}</p>
          <p><span className="font-semibold">Gender:</span> {profile?.gender}</p>
          <p><span className="font-semibold">Experience:</span> {profile?.experience} years</p>
          <p><span className="font-semibold">Premium:</span> {profile?.isPremium ? "Yes" : "No"}</p>
          <p><span className="font-semibold">Verified:</span> {profile?.isVerified ? "Yes" : "No"}</p>
          <p><span className="font-semibold">Location:</span> {profile?.location?.address}</p>
          <p><span className="font-semibold">Skills:</span> {profile?.skills?.map(skill => skill.name).join(", ")}</p>
        </div>

        {/* Book Expert Button */}
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          onClick={() => handleBookExpert(id)}
        >
          Book Expert
        </button>
      </div>
    </div>
  );
}
