const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(

  {
    bookingId: {
      type: String,
    },
    carId: {
      type: String,
    },
    rating: {
      type: Number,
    },
    review: {
      type: String,
    },
  },{timestamps: true});

const ReviewModel = mongoose.model('ReviewModel', reviewSchema);

export default ReviewModel