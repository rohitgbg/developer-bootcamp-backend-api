const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const router = express.Router();

const User = require("../models/User");

const advancedResults = require("../middleware/advancedResults");
const { protect, autorize } = require("../middleware/auth");

router.use(protect);
router.use(autorize("admin"));

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route("/:userId")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
