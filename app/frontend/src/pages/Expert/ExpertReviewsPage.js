import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpertReviews } from "../../redux/slices.js/expert-slice";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ExpertReviewsPage() {
  const { user } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating ] = useState(0)
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const id = user?._id;
      dispatch(getExpertReviews({id}))
        .unwrap()
        .then((reviews) => {
          setReviews(reviews);

          const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
          const average = reviews.length > 0 ? totalRatings / reviews.length : 0
          setAvgRating(average.toFixed(1))
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, user?._id]);

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews?.filter((review) => review.rating === rating).length,
  }));

  return (
    <div className="container mx-auto p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center border border-gray-200">
                <h1 className="text-lg font-semibold text-gray-700 mb-2">Total Reviews</h1>
                <h2 className="text-2xl font-bold text-blue-600">{reviews.length}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center border border-gray-200">
                <h1 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h1>
                <h2 className="text-2xl font-bold text-yellow-400">{avgRating || "N/A"}</h2>
            </div>
        </div>

      <div className="bg-white rounded-lg shadow-lg p-3 mb-4">
        <h1 className="text-xl font-semibold mb-4">Rating Distribution</h1>
        <div className="flex justify-center items-center h-48 bg-gray-100">
            <ResponsiveContainer width="90%" height="100%">
                <BarChart data={ratingCounts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="rating" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#FFC107" radius={[0, 10, 10, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-3">
        <h1 className="text-xl font-semibold mb-4">Latest Reviews</h1>
        {reviews?.length > 0 ? (
          reviews?.map((review) => (
            <div key={review._id} className="mb-4 p-2 border-b">
              <div className="flex items-center justify-between mb-2">
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
    </div>
  );
}
