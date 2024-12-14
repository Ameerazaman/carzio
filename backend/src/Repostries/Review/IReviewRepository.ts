import { ReviewDataInterface } from "../../Interface/ReviewInterface"

export interface IReviewRepository {

    getReviewAndRatings(carId: string): Promise<{ averageRating: number | null; reviews: string[] }>

    createReviewData(reviewData: ReviewDataInterface): Promise<ReviewDataInterface | null>

    checkBookidInReview(bookId: string): Promise<ReviewDataInterface | null>
}