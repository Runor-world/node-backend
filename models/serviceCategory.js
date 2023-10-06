const mongoose = require("mongoose");

const ServiceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide service name"],
    minlength: 3,
    maxlength: 30,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 200,
    required: [true, "Please provide service description"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
});

const ServiceCategoryModel = mongoose.model(
  "serviceCategory",
  ServiceCategorySchema
);

ServiceCategorySchema.virtual("reviews", {
  ref: "Reviews",
  localField: "_id",
  foreignField: "service",
  justOne: false,
});

// all reviews associated with a product to be removed using remove method
ServiceCategorySchema.pre("remove", async function (next) {
  await this.model("Reviews", this.deleteMany({ service: this._id }));
});

module.exports = { ServiceCategoryModel, ServiceCategorySchema };
