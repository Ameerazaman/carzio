import { ReviewDataInterface } from "../../Interface/ReviewInterface";
import ReviewModel from "../../Model/User/ReviewModel";
import { BaseRepository } from "../BaseRepostry";
import { IReviewRepository } from "./IReviewRepository";

export class ReviewRepository extends BaseRepository<typeof ReviewModel> implements IReviewRepository {
    constructor() {
        super(ReviewModel);
    }

     // ************************car ratings(star) in carDetails*****************
     async getReviewAndRatings(carId: string): Promise<{ averageRating: number | null; reviews: string[] }> {
        try {
            const result = await this.model.aggregate([
                { $match: { carId: carId } },
                {
                    $group: {
                        _id: null, // Group all matched documents
                        averageRating: { $avg: "$rating" }, // Calculate average rating
                        reviews: { $push: "$review" }, // Collect review texts
                    },
                },
            ]);
            if (result.length === 0) {
                return { averageRating: null, reviews: [] };
            }

            return {
                averageRating: result[0].averageRating,
                reviews: result[0].reviews,
            };
        } catch (error) {
            return { averageRating: null, reviews: [] };
        }
    }
    // **************************create Review and ratings*********************

    async createReviewData(reviewData: ReviewDataInterface): Promise<ReviewDataInterface | null> {
        try {
            const saveReview = await this.model.create(reviewData);
            return saveReview as ReviewDataInterface;
        } catch (error) {
            return null;
        }
    }

    // **********************check bookId in review*******************
    async checkBookidInReview(bookId: string): Promise<ReviewDataInterface | null> {
        try {
            let result = await this.model.findOne({ bookingId: bookId })
            return result as ReviewDataInterface
        } catch (error) {
            return null;
        }
    }
}