const express = require("express");

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require("../controllers/reviews");

const Review = require("../models/Reviews");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

const { protect, autorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description"
    }),
    getReviews
  )
  .post(protect, autorize("user", "admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, autorize("user", "admin"), updateReview)
  .delete(protect, autorize("user", "admin"), deleteReview);

module.exports = router;
