const express = require("express");

const {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addCourse
} = require("../controllers/courses");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

const { protect, autorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description"
    }),
    getCourses
  )
  .post(protect, autorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, autorize("publisher", "admin"), updateCourse)
  .delete(protect, autorize("publisher", "admin"), deleteCourse);

module.exports = router;
