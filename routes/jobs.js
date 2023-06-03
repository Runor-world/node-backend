const express = require("express");
const router = express.Router();

const {
  createJob,
  deleteJob,
  updateJob,
  getAllJobs,
  getSingleJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getSingleJob).patch(updateJob).delete(deleteJob);

module.exports = router;
