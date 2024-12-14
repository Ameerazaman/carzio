"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const ReviewModel_1 = __importDefault(require("../../Model/User/ReviewModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class ReviewRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(ReviewModel_1.default);
    }
    // ************************car ratings(star) in carDetails*****************
    getReviewAndRatings(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.aggregate([
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
            }
            catch (error) {
                return { averageRating: null, reviews: [] };
            }
        });
    }
    // **************************create Review and ratings*********************
    createReviewData(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveReview = yield this.model.create(reviewData);
                return saveReview;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************check bookId in review*******************
    checkBookidInReview(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.model.findOne({ bookingId: bookId });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.ReviewRepository = ReviewRepository;
