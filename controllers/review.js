const { StatusCodes } = require("http-status-codes");
const ReviewModel = require("../models/review");
const { BadRequestError } = require("../errors");
const { ServiceCategoryModel } = require("../models/serviceCategory");

const createReview = async (req, res) => {
  const { serviceId, rating, comment } = req.body;
  if (!serviceId) {
    throw new BadRequestError("Please add service Id");
  }
  if (!rating) {
    throw new BadRequestError("Please add rating");
  }
  if (!comment) {
    throw new BadRequestError("Please add comment");
  }

  const existingService = await ServiceCategoryModel.findById(serviceId);
  if (!existingService) {
    throw new BadRequestError(`Service with id ${serviceId} not found `);
  }
  req.body.user = req.user.userID;
  req.body.service = serviceId;

  const existingReview = await ReviewModel.findOne({
    user: req.body.user,
    service: serviceId,
  });

  if (existingReview) {
    throw new BadRequestError("Already reviewed this service");
  }

  const review = await ReviewModel.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Review successfully created", review });
};

const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  if (!reviewId) {
    throw new BadRequestError("Please provide review Id");
  }
  if (!rating) {
    throw new BadRequestError("Please add rating");
  }
  if (!comment) {
    throw new BadRequestError("Please add comment");
  }

  const existingReview = await ReviewModel.findById(reviewId);

  if (!existingReview) {
    throw new BadRequestError(`Review with ${id} id not found`);
  }
  existingReview.rating = rating;
  existingReview.comment = comment;
  await existingReview.save();
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Review successfully updated", existingReview });
};

const getAllReviews = async (req, res) => {
  const reviews = await ReviewModel.find({})
    .populate({
      path: "user",
      select: "firstName otherName _id active role location",
    })
    .populate({
      path: "service",
      select: "name description _id ",
    });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { reviewId } = req.params;
  if (!reviewId) {
    throw new BadRequestError("Please provide review Id");
  }

  const review = await ReviewModel.findById(reviewId)
    .populate({
      path: "user",
    })
    .populate({ path: "service", select: "name description" });

  if (review) {
    throw new BadRequestError(`Review with ${reviewId} not found`);
  }
  res.status(StatusCodes.OK).json({ review });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
};
