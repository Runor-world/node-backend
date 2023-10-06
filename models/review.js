const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide rating"],
      default: 0,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    service: {
      type: mongoose.Types.ObjectId,
      ref: "serviceCategory",
      required: [true, "Please provide service"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

// Ensure user has one review per service
ReviewSchema.index({ service: 1, user: 1 }, { unique: true });

// static method for calculating averageRating
// called whenever a review is created, update or removed
ReviewSchema.statics.calculateAverageRating = async function (serviceId) {
  const result = await this.aggregate([
    {
      $match: { service: serviceId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  try {
    await this.model("serviceCategory").findOneAndUpdate(
      { _id: serviceId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// update averageRatings and numOfReviews anytime a service is updated
ReviewSchema.post("save", async function (next) {
  await this.constructor.calculateAverageRating(this.service);
});

// update averageRatings and numOfReviews anytime a service is removed
ReviewSchema.post("remove", async function (next) {
  await this.constructor.calculateAverageRating(this.service);
});

const ReviewModel = mongoose.model("Review", ReviewSchema);
module.exports = ReviewModel;
