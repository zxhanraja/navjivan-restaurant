import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  setRating?: (r: number) => void;
  interactive?: boolean;
  size?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, interactive = true, size = 'text-3xl' }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className={`${size} ${interactive ? 'cursor-pointer' : ''} ${starValue <= (hover || rating) ? 'text-amber-400' : 'text-gray-300'}`}
            onClick={() => interactive && setRating && setRating(starValue)}
            onMouseEnter={() => interactive && setHover(starValue)}
            onMouseLeave={() => interactive && setHover(0)}
            disabled={!interactive}
            aria-label={`Rate ${starValue} stars`}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
