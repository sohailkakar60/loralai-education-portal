const express = require("express");

const {
  createReview,
  getPublicReviews,
} = require("../controllers/reviewController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/institution/:institutionId",
  getPublicReviews
);

router.post(
  "/",
  authenticateToken,
  createReview
);

module.exports = router;