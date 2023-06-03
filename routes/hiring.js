const express = require("express");
const authenticateUser = require("../middleware/auth");
const {
  createHiring,
  getAllHiring,
  getPendingHiringByUser,
  getAllHiringByUser,
} = require("../controllers/hiring");

const router = express.Router();

router.route("/").get(getAllHiring).post(authenticateUser, createHiring);
router.route("/user").get(authenticateUser, getAllHiringByUser);

module.exports = router;
