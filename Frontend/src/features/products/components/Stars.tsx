import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  size?: number;
}

export const Stars = ({ rating, size = 20 }: StarsProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          fill="currentColor"
          className="text-yellow-400"
        />
      ))}
      {halfStar && (
        <div className="relative inline-flex">
          <Star size={size} className="text-yellow-400" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <Star size={size} fill="currentColor" className="text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-yellow-400" />
      ))}
    </>
  );
};
