const StarRating = ({ rating = 5 }) => {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < rating ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRating;