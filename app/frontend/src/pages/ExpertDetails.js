import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExpertProfile, getExpertReviews } from "../redux/slices.js/expert-slice";
import { setSelectedExpert } from "../redux/slices.js/search-slice";

export default function ExpertDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { profile } = useSelector((state) => state.expert);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    dispatch(getExpertProfile(id));
  }, [dispatch, id]);

  const handleBookExpert = (id) => {
    dispatch(setSelectedExpert(profile));
    navigate(`/experts/${id}/categories`);
  };

  useEffect(()=>{
      dispatch(getExpertReviews(id))
       .unwrap()
       .then((reviews)=>{
          setReviews(reviews)
       }).catch((err)=>{
        console.log(err)
       })
  },[dispatch, id])
console.log(reviews)
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-8">
      {/* Profile Section */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center md:items-start p-8 space-y-6 md:space-y-0 md:space-x-8">
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
          {/* <p><span className="font-semibold">Premium:</span> {profile?.isPremium ? "Yes" : "No"}</p>
          <p><span className="font-semibold">Verified:</span> {profile?.isVerified ? "Yes" : "No"}</p> */}
          <p><span className="font-semibold">Location:</span> {profile?.location?.address}</p>
          <p className="font-semibold">Skills:</p>

        <div className="flex flex-wrap gap-2">
          {profile?.skills?.map((skill, index) => (
            <p 
              key={index} 
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
            >
            {skill.name}
            </p>
          ))}
        </div>

            
                        
        </div>

        {/* Book Expert Button */}
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          onClick={() => handleBookExpert(id)}
        >
          Book Expert
        </button>
      </div>
      {reviews?.map((review) => (
  <p key={review._id}>{review.reviewText}</p>
))}
    </div>
  );
}
