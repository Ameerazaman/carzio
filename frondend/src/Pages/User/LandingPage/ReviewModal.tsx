import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { createReviewAndRatings } from "../../../Api/User";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    carId: string
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, bookingId, carId }) => {
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [hover, setHover] = useState<number | null>(null);

    const handleSubmit = async () => {
        try {
            if (!rating || !review.trim()) {
                alert("Please add both a rating and a review.");
                return;
            }
            const reviewData = {
                bookingId,
                rating,
                review,
                carId
            };
            const result=await createReviewAndRatings(reviewData)
            if(result){
                alert("Thank you for your review!");
                onClose();
            }
        } catch (error) {
           
            alert("Failed to submit your review. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Your Review</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Rating:</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={24}
                                className={`cursor-pointer ${(hover || rating) >= star ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Review:</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full border rounded-lg p-2 h-24 focus:ring focus:ring-red-500"
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
