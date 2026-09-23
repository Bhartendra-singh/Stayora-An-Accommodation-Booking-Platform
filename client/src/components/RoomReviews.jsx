import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import StarRating from "./StarRating";
import toast from "react-hot-toast";

const ClickableStars = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer text-2xl select-none"
        >
          {(hovered || value) >= star ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
};

const RoomReviews = ({ roomId }) => {
  const { axios, getToken, user } = useAppContext();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/room-reviews/${roomId}`);
      if (data.success) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setCount(data.count);
      }
    } catch (error) {
      // silent — reviews are non-critical to the page loading
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) fetchReviews();
  }, [roomId]);

  const alreadyReviewed = reviews.some((r) => r.userId === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        "/api/room-reviews",
        { room: roomId, rating, comment: comment.trim() },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Review submitted");
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mt-16 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-playfair">Guest Reviews</h2>
        {count > 0 && (
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <StarRating rating={Math.round(avgRating)} />
            {avgRating.toFixed(1)} · {count} review{count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm mb-8">
          No reviews yet — be the first to share your experience.
        </p>
      ) : (
        <div className="space-y-6 mb-8">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                {r.userImage ? (
                  <img src={r.userImage} alt={r.userName} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {r.userName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.userName}</p>
                  <StarRating rating={r.rating} />
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-6 bg-white">
          <p className="text-sm font-medium text-gray-800 mb-3">Write a review</p>
          <ClickableStars value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this room..."
            className="w-full mt-3 p-2 border border-gray-300 rounded text-sm"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-primary text-white px-6 py-2 rounded text-sm disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {user && alreadyReviewed && (
        <p className="text-sm text-gray-400">You've already reviewed this room.</p>
      )}
    </div>
  );
};

export default RoomReviews;