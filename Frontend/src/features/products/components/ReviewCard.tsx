import { IReview } from "@/types/entities/review.types";
import { MessageCircle } from "lucide-react";
import { formatReviewDate } from "../MockData";
import { Stars } from "./Stars";

type Props = {
  review: IReview;
  starSize?: number;
};

export default function ReviewCard({ review, starSize = 14 }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:shadow-sm transition-shadow">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
            {review.customerId?.slice(-1).toUpperCase() || "ع"}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {review.customerId || "عميل"}
            </p>
            <p className="text-xs text-gray-500">
              {review.createdAt
                ? formatReviewDate(new Date(review.createdAt))
                : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-0.5">
          <Stars rating={review.rating} size={starSize} />
        </div>
      </div>

      <p className="mb-3 text-sm leading-6 text-gray-700">
        {review.reviewText}
      </p>

      {review.storeResponse && (
        <div className="rounded-lg border-r-4 border-blue-500 bg-blue-50 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold text-blue-900">
            <MessageCircle size={14} />
            رد المتجر
          </div>
          <p className="text-blue-800">{review.storeResponse}</p>
        </div>
      )}
    </div>
  );
}
