const express = require("express");
const authenticateUser = require("../middleware/auth");
const {
  createReview,
  getSingleReview,
  getAllReviews,
  updateReview,
} = require("../controllers/review");
const router = express.Router();

router.route("/").post(authenticateUser, createReview).get(getAllReviews);
router
  .route("/:reviewId")
  .get(authenticateUser, getSingleReview)
  .patch(authenticateUser, updateReview);

module.exports = router;
