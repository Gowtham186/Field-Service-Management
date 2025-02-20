import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExpertProfile, getExpertReviews, setReviewsNull } from "../redux/slices.js/expert-slice";
import { setSelectedExpert } from "../redux/slices.js/search-slice";

export default function ExpertDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { profile, reviews, loading } = useSelector((state) => state.expert);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(setReviewsNull()); // Reset reviews
      dispatch(getExpertProfile({ id }));
      dispatch(getExpertReviews({ id })); // Fetch all reviews at once
    }
  }, [dispatch, id]);

  const handleBookExpert = () => {
    dispatch(setSelectedExpert(profile));
    navigate(`/experts/${id}/categories`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-8">
      {/* Profile Section */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center md:items-start p-8 space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-40 h-40">
          <img
            src={profile?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">{profile?.userId?.name}</h1>
          <p><span className="font-semibold">Age:</span> {profile?.age}</p>
          <p><span className="font-semibold">Gender:</span> {profile?.gender}</p>
          <p><span className="font-semibold">Experience:</span> {profile?.experience} years</p>
          <p><span className="font-semibold">Location:</span> {profile?.location?.address}</p>
          <p className="font-semibold">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill, index) => (
              <p key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {skill.name}
              </p>
            ))}
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          onClick={handleBookExpert}
        >
          Book Expert
        </button>
      </div>

      {reviews?.loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-3 w-full mt-4">
          <h1 className="text-xl font-semibold mb-4">Latest Reviews</h1>
          {reviews?.data?.length > 0 ? (
            reviews?.data.map((review) => (
              <div key={review._id} className="mb-4 p-4 border-b flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{review.reviewer?.name || "Anonymous"}</h2>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      )}
    </div>
  );
}
